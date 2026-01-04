import { useState } from 'react';
import TaskItem from './TaskItem';

export default function TaskList({ tasks, toggleTask, deleteTask, setEditingTask, reorderTasks, onTagClick }) {
  const [draggedIndex, setDraggedIndex] = useState(null);

  const moveTask = (hoverIndex) => {
    if (draggedIndex !== null && draggedIndex !== hoverIndex) {
      reorderTasks(draggedIndex, hoverIndex);
      setDraggedIndex(hoverIndex);
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <p>Nenhuma tarefa encontrada. Adicione sua primeira tarefa acima! 📝</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task, index) => (
        <TaskItem
          key={task.id}
          task={task}
          index={index}
          toggleTask={toggleTask}
          deleteTask={deleteTask}
          setEditingTask={setEditingTask}
          moveTask={moveTask}
          onTagClick={onTagClick}
        />
      ))}
    </div>
  );
}
