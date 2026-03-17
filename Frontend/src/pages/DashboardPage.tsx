import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { tasksAPI,type Task } from '../services/api';
import  TaskCard  from '../components/TaskCard';
import TaskModal  from '../components/TaskModal';
import { Navbar } from '../components/Navbar';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [totalTasks, setTotalTasks] = useState(0);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    fetchTasks();
  }, [currentPage, status, search]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await tasksAPI.getTasks({
        page: currentPage,
        limit: 4,
        status: status || undefined,
        search: search || undefined,
      });
      setTasks(data.tasks);
      setTotalPages(data.pagination.totalPages);
      setTotalTasks(data.pagination.totalTasks);
    } catch (err: any) {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await tasksAPI.deleteTask(taskId);
      fetchTasks();
    } catch (err) {
      alert('Failed to delete task');
    }
  };

  const handleTaskSaved = () => {
    setIsModalOpen(false);
    setEditingTask(null);
    fetchTasks();
  };

  const handleStatusFilter = (newStatus: string) => {
    setStatus(newStatus);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}! 👋</h1>
          <p className="mt-1 text-sm text-gray-600">{totalTasks} tasks total</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="card hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleStatusFilter('PENDING')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">
                  {tasks.filter(t => t.status === 'PENDING').length}
                </p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleStatusFilter('IN_PROGRESS')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">
                  {tasks.filter(t => t.status === 'IN_PROGRESS').length}
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleStatusFilter('COMPLETED')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">
                  {tasks.filter(t => t.status === 'COMPLETED').length}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="card mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <input
                type="text"
                className="input"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleStatusFilter('')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  status === '' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                All
              </button>
              <button
                onClick={() => handleStatusFilter('PENDING')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  status === 'PENDING' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => handleStatusFilter('IN_PROGRESS')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  status === 'IN_PROGRESS' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                In Progress
              </button>
              <button
                onClick={() => handleStatusFilter('COMPLETED')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  status === 'COMPLETED' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Completed
              </button>
            </div>

            <button onClick={handleCreateTask} className="btn-primary whitespace-nowrap">
              + New Task
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p>{error}</p>
          </div>
        )}

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        )}

        {!loading && tasks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        )}

        {!loading && tasks.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-sm font-medium text-gray-900">No tasks found</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new task.</p>
            <button onClick={handleCreateTask} className="btn-primary mt-6">+ New Task</button>
          </div>
        )}

        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="btn-secondary disabled:opacity-50"
            >
              Previous
            </button>
            
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentPage === i + 1 ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 border border-gray-300'
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="btn-secondary disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <TaskModal
          task={editingTask}
          onClose={() => {
            setIsModalOpen(false);
            setEditingTask(null);
          }}
          onSave={handleTaskSaved}
        />
      )}
    </div>
  );
};