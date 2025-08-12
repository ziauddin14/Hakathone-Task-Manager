import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import useAuthStore from '../../store/authStore';
import useTaskStore from '../../store/taskStore';
import AddTaskForm from './AddTaskForm';
import TaskTable from './TaskTable';
import { LogOut, User, CheckCircle } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { fetchTasks } = useTaskStore();

  useEffect(() => {
    // Check if user is authenticated
    console.log('Dashboard useEffect - isAuthenticated:', isAuthenticated, 'user:', user);
    if (!isAuthenticated || !user) {
      console.log('User not authenticated, navigating to login');
      navigate('/login');
      return;
    }

    console.log('User authenticated, fetching tasks for userId:', user.uid);
    // Fetch tasks for the current user
    const unsubscribe = fetchTasks(user.uid);

    // Cleanup subscription on unmount
    return () => {
      if (unsubscribe) {
        console.log('Cleaning up task subscription');
        unsubscribe();
      }
    };
  }, [isAuthenticated, user, navigate, fetchTasks]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      logout();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-indigo-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Task Manager</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              
              <div className="flex items-center text-sm text-gray-700">
                <User className="h-4 w-4 mr-2" />
                <span className="font-medium">{user.email}</span>
                {!user.emailVerified && (
                  <span className="ml-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                    Unverified
                  </span>
                )}
              </div>
              
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Add Task Form */}
          <AddTaskForm />

          {/* Task Table */}
          <TaskTable />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
