import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { FiSun, FiMoon, FiCheckCircle, FiCircle, FiAlertCircle, FiSearch, FiX, FiArrowDown } from 'react-icons/fi';
import { useTasks } from './hooks/useTasks';
import { useLocalStorage } from './hooks/useLocalStorage';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import FilterBar from './components/FilterBar';
import CategoryManager from './components/CategoryManager';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const taskFormRef = useState(null);

  const {
    tasks,
    allTasks,
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
    statistics,
  } = useTasks();

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    const handleKeyboard = (e) => {
      // Ctrl+N para focar no formulário de nova tarefa
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        document.querySelector('.task-input')?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, []);

  const handleTagClick = (tag) => {
    setSelectedTag(tag);
    setFilter('all');
  };

  const clearTagFilter = () => {
    setSelectedTag(null);
  };

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'}`}>
      <Toaster />
      
      <header className="app-header">
        <div className="header-left">
          <span className="logo">☀ PLONIX</span>
        </div>
        <div className="header-center">
          <h1 className="app-title">MINHAS NOTAS</h1>
          <div className="header-right">
            <button className="icon-btn">
              <FiSearch />
            </button>
            <button onClick={toggleTheme} className="icon-btn" title="Alternar tema">
              {darkMode ? <FiSun /> : <FiMoon />}
            </button>
          </div>
        </div>
      </header>

      <div className="app-body">
        <aside className="sidebar">
          <div className="sidebar-section">
            <h3 className="sidebar-title">TODAS</h3>
            <div className="sidebar-list">
              {categories.map(cat => {
                const count = allTasks.filter(t => t.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setFilter('all');
                    }}
                    className={`sidebar-item ${selectedCategory === cat && filter === 'all' ? 'active' : ''}`}
                  >
                    <FiCircle className="item-icon" />
                    {cat.toUpperCase()}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-title">CONCLUÍDOS</h3>
            <div className="sidebar-list">
              {categories.map(cat => {
                const count = allTasks.filter(t => t.category === cat && t.completed).length;
                if (count === 0) return null;
                return (
                  <button
                    key={`completed-${cat}`}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setFilter('completed');
                    }}
                    className={`sidebar-item ${selectedCategory === cat && filter === 'completed' ? 'active' : ''}`}
                  >
                    <FiCheckCircle className="item-icon" />
                    {cat.toUpperCase()}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-title">PENDENTES</h3>
            <div className="sidebar-list">
              {categories.map(cat => {
                const count = allTasks.filter(t => t.category === cat && !t.completed).length;
                if (count === 0) return null;
                return (
                  <button
                    key={`pending-${cat}`}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setFilter('pending');
                    }}
                    className={`sidebar-item ${selectedCategory === cat && filter === 'pending' ? 'active' : ''}`}
                  >
                    <FiCircle className="item-icon" />
                    {cat.toUpperCase()}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-title">URGENTES</h3>
            <div className="sidebar-list">
              {categories.map(cat => {
                const count = allTasks.filter(t => t.category === cat && t.priority === 'urgent' && !t.completed).length;
                if (count === 0) return null;
                return (
                  <button
                    key={`urgent-${cat}`}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setFilter('urgent');
                    }}
                    className={`sidebar-item ${selectedCategory === cat && filter === 'urgent' ? 'active' : ''}`}
                  >
                    <FiAlertCircle className="item-icon" />
                    {cat.toUpperCase()}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => setShowCategoryManager(!showCategoryManager)}
            className="sidebar-btn"
          >
            {showCategoryManager ? '- Ocultar Categorias' : '+ Gerenciar Categorias'}
          </button>
        </aside>

        <main className="main-content">
          <div className="content-wrapper">
          <section className="task-form-section">
            <TaskForm
              addTask={addTask}
              updateTask={updateTask}
              editingTask={editingTask}
              setEditingTask={setEditingTask}
              categories={categories}
            />
          </section>

          {selectedTag && (
            <div className="active-filter">
              <span className="filter-badge">
                Filtrando por: <strong>#{selectedTag}</strong>
                <button onClick={clearTagFilter} className="clear-filter">
                  <FiX />
                </button>
              </span>
            </div>
          )}

          <section className="controls-section">
            <div className="search-bar">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Buscar tarefas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="sort-control">
              <FiArrowDown className="sort-icon" />
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <optgroup label="📅 Por Data de Criação">
                  <option value="createdAt-desc">Criadas recentemente</option>
                  <option value="createdAt-asc">Criadas há mais tempo</option>
                </optgroup>
                <optgroup label="⏰ Por Prazo">
                  <option value="dueDate-asc">Vence primeiro</option>
                  <option value="dueDate-desc">Vence depois</option>
                </optgroup>
                <optgroup label="🎯 Por Prioridade">
                  <option value="priority-desc">Prioridade Alta → Baixa</option>
                  <option value="priority-asc">Prioridade Baixa → Alta</option>
                </optgroup>
                <optgroup label="🔤 Ordem Alfabética">
                  <option value="alphabetical-asc">A → Z</option>
                  <option value="alphabetical-desc">Z → A</option>
                </optgroup>
              </select>
            </div>
          </section>

          {showCategoryManager && (
            <section className="category-section">
              <CategoryManager
                categories={categories}
                addCategory={addCategory}
                deleteCategory={deleteCategory}
              />
            </section>
          )}

          <section className="task-list-section">
            <TaskList
              tasks={tasks}
              toggleTask={toggleTask}
              deleteTask={deleteTask}
              setEditingTask={setEditingTask}
              reorderTasks={reorderTasks}
              onTagClick={handleTagClick}
            />
          </section>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
