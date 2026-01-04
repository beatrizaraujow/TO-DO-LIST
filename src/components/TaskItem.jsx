import { FiEdit2, FiTrash2, FiCalendar, FiMove } from 'react-icons/fi';
import { format, isPast, isToday, isTomorrow } from 'date-fns';
import { notifyTaskActions } from '../utils/notifications';

const PRIORITY_COLORS = {
  low: '#4a7c59',
  medium: '#d4a574',
  high: '#f97316',
  urgent: '#c25b56',
};

export default function TaskItem({ task, toggleTask, deleteTask, setEditingTask, index, moveTask, onTagClick }) {
  const handleToggle = () => {
    toggleTask(task.id);
    if (!task.completed) {
      notifyTaskActions.completed();
    } else {
      notifyTaskActions.uncompleted();
    }
  };

  const handleDelete = () => {
    deleteTask(task.id);
    notifyTaskActions.deleted();
  };

  const handleDragStart = (e) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget);
    e.currentTarget.classList.add('dragging');
  };

  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove('dragging');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const item = e.currentTarget;
    item.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    moveTask(index);
  };

  const getDueDateLabel = () => {
    if (!task.dueDate) return null;
    
    const dueDate = new Date(task.dueDate);
    const overdue = isPast(dueDate) && !isToday(dueDate);
    
    let label = format(dueDate, 'dd/MM/yyyy');
    if (isToday(dueDate)) label = 'Hoje';
    if (isTomorrow(dueDate)) label = 'Amanhã';
    
    return (
      <span className={`due-date ${overdue && !task.completed ? 'overdue' : ''}`}>
        <FiCalendar /> {label}
      </span>
    );
  };

  return (
    <div 
      className={`task-item ${task.completed ? 'completed' : ''}`}
      draggable={!task.completed}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="task-main">
        <div className="drag-handle">
          <FiMove />
        </div>
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleToggle}
          className="task-checkbox"
        />
        <div className="task-content">
          <p className="task-text">{task.text}</p>
          <div className="task-meta">
            <span className="task-category">{task.category}</span>
            <span 
              className="task-priority" 
              style={{ backgroundColor: PRIORITY_COLORS[task.priority] }}
            >
              {task.priority}
            </span>
            {getDueDateLabel()}
          </div>
          {task.tags.length > 0 && (
            <div className="task-tags">
              {task.tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="tag"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTagClick(tag);
                  }}
                  title={`Filtrar por #${tag}`}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="task-actions">
        <button 
          onClick={() => setEditingTask(task)} 
          className="btn-icon"
          title="Editar tarefa"
        >
          <FiEdit2 />
        </button>
        <button 
          onClick={handleDelete} 
          className="btn-icon btn-delete"
          title="Excluir tarefa"
        >
          <FiTrash2 />
        </button>
      </div>
    </div>
  );
}
