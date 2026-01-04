import { useState } from 'react';
import { FiPlus, FiX } from 'react-icons/fi';
import { notify } from '../utils/notifications';

export default function CategoryManager({ categories, addCategory, deleteCategory }) {
  const [newCategory, setNewCategory] = useState('');
  const [showInput, setShowInput] = useState(false);

  const handleAdd = () => {
    if (newCategory.trim()) {
      addCategory(newCategory.trim());
      setNewCategory('');
      setShowInput(false);
      notify.success('Categoria adicionada!');
    }
  };

  const handleDelete = (category) => {
    if (categories.length <= 1) {
      notify.error('Você deve ter pelo menos uma categoria!');
      return;
    }
    deleteCategory(category);
    notify.info('Categoria excluída');
  };

  return (
    <div className="category-manager">
      <h3>Gerenciar Categorias</h3>
      <div className="category-list">
        {categories.map(cat => (
          <div key={cat} className="category-item">
            <span>{cat}</span>
            <button 
              onClick={() => handleDelete(cat)} 
              className="btn-icon btn-delete"
              title="Excluir categoria"
            >
              <FiX />
            </button>
          </div>
        ))}
      </div>
      
      {showInput ? (
        <div className="add-category">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Nome da nova categoria"
            className="category-input"
            autoFocus
          />
          <button onClick={handleAdd} className="btn btn-primary btn-sm">
            <FiPlus /> Adicionar
          </button>
          <button onClick={() => setShowInput(false)} className="btn btn-secondary btn-sm">
            Cancelar
          </button>
        </div>
      ) : (
        <button onClick={() => setShowInput(true)} className="btn btn-outline">
          <FiPlus /> Adicionar Categoria
        </button>
      )}
    </div>
  );
}
