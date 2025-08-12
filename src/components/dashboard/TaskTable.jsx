import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import useTaskStore from '../../store/taskStore';
import { 
  CheckCircle, 
  Circle, 
  Edit, 
  Trash2, 
  Filter, 
  Calendar,
  Clock,
  RefreshCw,
  Search,
  FileText
} from 'lucide-react';
import Swal from 'sweetalert2';

const TaskTable = () => {
  const [editingTask, setEditingTask] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const {
    tasks,
    isLoading,
    filter,
    setFilter,
    getFilteredTasks,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    fetchTasks
  } = useTaskStore();

  // Validation schema for edit form
  const editValidationSchema = Yup.object({
    name: Yup.string()
      .min(3, 'Task name must be at least 3 characters')
      .max(100, 'Task name must be less than 100 characters')
      .required('Task name is required'),
    description: Yup.string()
      .max(500, 'Description must be less than 500 characters'),
    deadline: Yup.date()
      .min(new Date(), 'Deadline must be today or in the future')
      .required('Deadline is required'),
  });

  // Handle edit task
  const handleEditTask = async (values, { setSubmitting }) => {
    try {
      await updateTask(editingTask.id, values);
      setEditingTask(null);
      setShowEditForm(false);
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete task
  const handleDeleteTask = async (taskId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      await deleteTask(taskId);
    }
  };

  // Handle status toggle
  const handleStatusToggle = async (taskId, currentStatus) => {
    await toggleTaskStatus(taskId, currentStatus);
  };

  // Handle sync tasks
  const handleSyncTasks = () => {
    // This would typically refresh the tasks from the server
    // For now, we'll just show a message
    Swal.fire({
      icon: 'success',
      title: 'Tasks Synced',
      text: 'Tasks have been synchronized successfully!'
    });
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  // Check if task is overdue
  const isOverdue = (deadline) => {
    return new Date(deadline) < new Date();
  };

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Get filtered and searched tasks
  const getFilteredAndSearchedTasks = () => {
    let filtered = getFilteredTasks();
    
    if (searchTerm.trim()) {
      filtered = filtered.filter(task => 
        task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    return filtered;
  };

  const filteredTasks = getFilteredAndSearchedTasks();
  
  console.log('TaskTable render - tasks:', tasks, 'filteredTasks:', filteredTasks, 'isLoading:', isLoading);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header with Sync Tasks button */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-medium text-gray-900">Tasks</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Filter:</span>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="all">All Tasks</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          
          <button
            onClick={handleSyncTasks}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync Tasks
          </button>
        </div>

        {/* Search Bar */}
        <div className="mt-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Task Count */}
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredTasks.length} of {tasks.length} tasks
        </div>
      </div>

      {/* Task List */}
      <div className="overflow-x-auto">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-16 w-16 text-gray-300" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No tasks found</h3>
            <p className="mt-2 text-sm text-gray-500">
              Create your first task to get started!
            </p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  TASK
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  DEADLINE
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  STATUS
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50">
                  {/* Task Details */}
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {task.name}
                    </div>
                    {task.description && (
                      <div className="text-sm text-gray-500 mt-1">
                        {task.description.length > 100
                          ? `${task.description.substring(0, 100)}...`
                          : task.description
                        }
                      </div>
                    )}
                  </td>

                  {/* Deadline */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${
                      isOverdue(task.deadline) && task.status !== 'completed'
                        ? 'text-red-600 font-medium'
                        : 'text-gray-900'
                    }`}>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(task.deadline)}
                      </div>
                      {isOverdue(task.deadline) && task.status !== 'completed' && (
                        <div className="text-xs text-red-500 mt-1">Overdue</div>
                      )}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleStatusToggle(task.id, task.status)}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        task.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {task.status === 'completed' ? (
                        <CheckCircle className="h-4 w-4 mr-1" />
                      ) : (
                        <Circle className="h-4 w-4 mr-1" />
                      )}
                      {task.status}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setEditingTask(task);
                          setShowEditForm(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit Modal */}
      {showEditForm && editingTask && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Edit Task</h3>
                <button
                  onClick={() => {
                    setEditingTask(null);
                    setShowEditForm(false);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <Formik
                initialValues={{
                  name: editingTask.name,
                  description: editingTask.description || '',
                  deadline: editingTask.deadline.split('T')[0],
                }}
                validationSchema={editValidationSchema}
                onSubmit={handleEditTask}
              >
                {({ isSubmitting, errors, touched }) => (
                  <Form className="space-y-4">
                    {/* Task Name */}
                    <div>
                      <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1">
                        Task Name *
                      </label>
                      <Field
                        id="edit-name"
                        name="name"
                        type="text"
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:z-10 sm:text-sm ${
                          errors.name && touched.name
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                        }`}
                      />
                      <ErrorMessage
                        name="name"
                        component="div"
                        className="mt-1 text-sm text-red-600"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <Field
                        id="edit-description"
                        name="description"
                        as="textarea"
                        rows={3}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:z-10 sm:text-sm ${
                          errors.description && touched.description
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                        }`}
                      />
                      <ErrorMessage
                        name="description"
                        component="div"
                        className="mt-1 text-sm text-red-600"
                      />
                    </div>

                    {/* Deadline */}
                    <div>
                      <label htmlFor="edit-deadline" className="block text-sm font-medium text-gray-700 mb-1">
                        Deadline *
                      </label>
                      <Field
                        id="edit-deadline"
                        name="deadline"
                        type="date"
                        min={getTodayDate()}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:z-10 sm:text-sm ${
                          errors.deadline && touched.deadline
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                        }`}
                      />
                      <ErrorMessage
                        name="deadline"
                        component="div"
                        className="mt-1 text-sm text-red-600"
                      />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingTask(null);
                          setShowEditForm(false);
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                      >
                        {isSubmitting ? 'Updating...' : 'Update Task'}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskTable;
