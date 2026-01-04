import { useState, useRef, useEffect } from 'react';
import { FiPlus, FiX } from 'react-icons/fi';
import { notifyTaskActions } from '../utils/notifications';

const PRIORITIES = [
  { value: 'low', label: 'Baixa' },
  { value: 'medium', label: 'Média' },
  { value: 'high', label: 'Alta' },
  { value: 'urgent', label: 'Urgente' }
];

export default function TaskForm({ addTask, updateTask, editingTask, setEditingTask, categories }) {
  const [text, setText] = useState(editingTask?.text || '');
  const [category, setCategory] = useState(editingTask?.category || categories[0]);
  const [priority, setPriority] = useState(editingTask?.priority || 'medium');
  const [tags, setTags] = useState(editingTask?.tags?.join(', ') || '');
  const [dueDate, setDueDate] = useState(editingTask?.dueDate || '');
  const inputRef = useRef(null);

  useEffect(() => {
    if (editingTask) {
      setText(editingTask.text);
      setCategory(editingTask.category);
      setPriority(editingTask.priority);
      setTags(editingTask.tags?.join(', ') || '');
      setDueDate(editingTask.dueDate || '');
      inputRef.current?.focus();
    }
  }, [editingTask]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && editingTask) {
        handleCancel();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [editingTask]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const taskData = {
      text: text.trim(),
      category,
      priority,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      dueDate: dueDate || null,
    };

    if (editingTask) {
      updateTask(editingTask.id, taskData);
      notifyTaskActions.updated();
      setEditingTask(null);
    } else {
      addTask(taskData);
      notifyTaskActions.added();
    }

    setText('');
    setCategory(categories[0]);
    setPriority('medium');
    setTags('');
    setDueDate('');
  };

  const handleCancel = () => {
    setEditingTask(null);
    setText('');
    setCategory(categories[0]);
    setPriority('medium');
    setTags('');
    setDueDate('');
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <div className="form-group">
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="O que precisa ser feito?"
          className="task-input"
          autoFocus
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Categoria</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="form-select">
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Prioridade</label>
          <select value={priority} onChange={(e) => setPriority(e.target.value)} className="form-select">
            {PRIORITIES.map(p => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Data de Vencimento</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="form-input"
          />
        </div>
      </div>

      <div className="form-group">
        <label>Tags (separadas por vírgula)</label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="ex: importante, urgente, reunião"
          className="form-input"
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          <FiPlus /> {editingTask ? 'Atualizar Tarefa' : 'Adicionar Tarefa'}
        </button>
        {editingTask && (
          <button type="button" onClick={handleCancel} className="btn btn-secondary">
            <FiX /> Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
