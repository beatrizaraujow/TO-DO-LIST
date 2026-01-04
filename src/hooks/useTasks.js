import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

const DEFAULT_CATEGORIES = ['Trabalho', 'Pessoal', 'Compras', 'Saúde'];

export function useTasks() {
  const [tasks, setTasks] = useLocalStorage('tasks', []);
  const [categories, setCategories] = useLocalStorage('categories', DEFAULT_CATEGORIES);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedTag, setSelectedTag] = useState(null);
  const [sortBy, setSortBy] = useState('createdAt-desc');

  const addTask = (task) => {
    const newTask = {
      id: Date.now(),
      text: task.text,
      completed: false,
      category: task.category,
      priority: task.priority || 'medium',
      tags: task.tags || [],
      dueDate: task.dueDate || null,
      createdAt: new Date().toISOString(),
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (id, updatedTask) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, ...updatedTask } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const reorderTasks = (dragIndex, hoverIndex) => {
    const filteredTasks = getFilteredTasks();
    const dragTask = filteredTasks[dragIndex];
    const newFilteredTasks = [...filteredTasks];
    newFilteredTasks.splice(dragIndex, 1);
    newFilteredTasks.splice(hoverIndex, 0, dragTask);
    
    // Atualizar ordem no array completo
    const updatedTasks = [...tasks];
    const taskIds = newFilteredTasks.map(t => t.id);
    
    // Reordenar apenas as tarefas filtradas mantendo as outras no lugar
    const reorderedTasks = updatedTasks.map(task => {
      const newIndex = taskIds.indexOf(task.id);
      if (newIndex !== -1) {
        return { ...task, order: newIndex };
      }
      return task;
    });
    
    setTasks(reorderedTasks.sort((a, b) => (a.order || 0) - (b.order || 0)));
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const addCategory = (category) => {
    if (!categories.includes(category)) {
      setCategories([...categories, category]);
    }
  };

  const deleteCategory = (category) => {
    setCategories(categories.filter(cat => cat !== category));
    setTasks(tasks.map(task => 
      task.category === category ? { ...task, category: 'Pessoal' } : task
    ));
  };

  const getFilteredTasks = () => {
    let filtered = [...tasks];

    // Filter by status
    if (filter === 'completed') {
      filtered = filtered.filter(task => task.completed);
    } else if (filter === 'pending') {
      filtered = filtered.filter(task => !task.completed);
    } else if (filter === 'urgent') {
      filtered = filtered.filter(task => task.priority === 'urgent' && !task.completed);
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(task => task.category === selectedCategory);
    }

    // Filter by priority
    if (selectedPriority !== 'all') {
      filtered = filtered.filter(task => task.priority === selectedPriority);
    }

    // Filter by tag
    if (selectedTag) {
      filtered = filtered.filter(task => task.tags.includes(selectedTag));
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(task =>
        task.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Sort tasks
    const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
    
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'priority-desc':
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'priority-asc':
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        case 'dueDate-asc':
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        case 'dueDate-desc':
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(b.dueDate) - new Date(a.dueDate);
        case 'alphabetical-asc':
          return a.text.localeCompare(b.text);
        case 'alphabetical-desc':
          return b.text.localeCompare(a.text);
        case 'createdAt-asc':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'createdAt-desc':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    return filtered;
  };

  const getStatistics = () => {
    return {
      total: tasks.length,
      completed: tasks.filter(t => t.completed).length,
      pending: tasks.filter(t => !t.completed).length,
      urgent: tasks.filter(t => t.priority === 'urgent' && !t.completed).length,
    };
  };

  return {
    tasks: getFilteredTasks(),
    allTasks: tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    reorderTasks,
    categories,
    addCategory,
    deleteCategory,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedPriority,
    setSelectedPriority,
    selectedTag,
    setSelectedTag,
    sortBy,
    setSortBy,
    statistics: getStatistics(),
  };
}
