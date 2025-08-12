import { create } from 'zustand';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../firebase';
import Swal from 'sweetalert2';

const useTaskStore = create((set, get) => ({
  // Task state
  tasks: [],
  isLoading: false,
  filter: 'all', // 'all', 'pending', 'completed'

  // Actions
  setLoading: (loading) => set({ isLoading: loading }),

  setFilter: (filter) => set({ filter }),

  // Add sample task for testing
  addSampleTask: async (userId) => {
    try {
      console.log('Adding sample task for userId:', userId);
      const sampleTask = {
        name: 'Sample Task',
        description: 'This is a sample task to test the system',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        userId,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await addDoc(collection(db, 'tasks'), sampleTask);
      console.log('Sample task added successfully');
    } catch (error) {
      console.error('Error adding sample task:', error);
    }
  },

  // Fetch tasks from Firestore
  fetchTasks: (userId) => {
    console.log('fetchTasks called with userId:', userId);
    if (!userId) {
      console.log('No userId provided, returning early');
      return;
    }

    set({ isLoading: true });
    console.log('Setting loading to true');
    
    const q = query(
      collection(db, 'tasks'),
      where('userId', '==', userId)
      // Temporarily removed orderBy to debug
      // orderBy('createdAt', 'desc')
    );

    console.log('Created query:', q);

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log('Query snapshot received:', querySnapshot);
      const tasks = [];
      querySnapshot.forEach((doc) => {
        console.log('Document data:', doc.data());
        tasks.push({
          id: doc.id,
          ...doc.data()
        });
      });
      console.log('Final tasks array:', tasks);
      set({ tasks, isLoading: false });
    }, (error) => {
      console.error('Error fetching tasks:', error);
      set({ isLoading: false });
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch tasks'
      });
    });

    return unsubscribe;
  },

  // Add new task
  addTask: async (taskData, userId) => {
    try {
      set({ isLoading: true });
      
      const newTask = {
        ...taskData,
        userId,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await addDoc(collection(db, 'tasks'), newTask);
      
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Task added successfully!'
      });
    } catch (error) {
      console.error('Error adding task:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to add task'
      });
    } finally {
      set({ isLoading: false });
    }
  },

  // Update task
  updateTask: async (taskId, updates) => {
    try {
      set({ isLoading: true });
      
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, {
        ...updates,
        updatedAt: new Date()
      });

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Task updated successfully!'
      });
    } catch (error) {
      console.error('Error updating task:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update task'
      });
    } finally {
      set({ isLoading: false });
    }
  },

  // Delete task
  deleteTask: async (taskId) => {
    try {
      set({ isLoading: true });
      
      const taskRef = doc(db, 'tasks', taskId);
      await deleteDoc(taskRef);

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Task deleted successfully!'
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to delete task'
      });
    } finally {
      set({ isLoading: false });
    }
  },

  // Toggle task status
  toggleTaskStatus: async (taskId, currentStatus) => {
    const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
    await get().updateTask(taskId, { status: newStatus });
  },

  // Get filtered tasks
  getFilteredTasks: () => {
    const { tasks, filter } = get();
    
    switch (filter) {
      case 'pending':
        return tasks.filter(task => task.status === 'pending');
      case 'completed':
        return tasks.filter(task => task.status === 'completed');
      default:
        return tasks;
    }
  }
}));

export default useTaskStore;
