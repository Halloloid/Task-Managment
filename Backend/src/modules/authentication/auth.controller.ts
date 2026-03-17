import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../../config/db.js';
import jwt, { SignOptions } from "jsonwebtoken";


// Register new user
export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, name } = req.body;

        // Validation
        if (!email || !password || !name) {
            res.status(400).json({
                error: 'Validation error',
                details: ['Email, password, and name are required'],
            });
            return;
        }

        if(typeof email != "string" || typeof password !="string" || typeof name != "string") return res.status(400).json({message:"Invalid Type"});

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.status(400).json({
                error: 'Validation error',
                details: ['Invalid email format'],
            });
            return;
        }

        // Password strength validation
        if (password.length < 8) {
            res.status(400).json({
                error: 'Validation error',
                details: ['Password must be at least 8 characters'],
            });
            return;
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            res.status(409).json({ error: 'User with this email already exists' });
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
            },
        });

        res.status(201).json({
            message: 'User registered successfully',
            user,
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Login user
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            res.status(400).json({
                error: 'Validation error',
                details: ['Email and password are required'],
            });
            return;
        }

        // Find user
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        const secret = process.env.JWT_SECRET as string;

        // Generate JWT
        const options: SignOptions = {
            expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as SignOptions["expiresIn"]
        };

        const token = jwt.sign(
            { id: user.id, email: user.email },
            secret,
            options
        );
        // Set HTTP-only cookie
        res.cookie('access_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'devlopment',
            sameSite: process.env.NODE_ENV === 'devlopment' ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Logout user
export const logout = async (req: Request, res: Response): Promise<void> => {
    res.clearCookie('access_token');
    res.status(200).json({ message: 'Logged out successfully' });
};

// Get current user
export const getCurrentUser = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const userId = req.user!.id;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
            },
        });

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};