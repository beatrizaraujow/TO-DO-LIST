import toast from 'react-hot-toast';

export const notify = {
  success: (message) => toast.success(message, {
    duration: 3000,
    position: 'top-right',
    style: {
      background: '#10b981',
      color: '#fff',
    },
  }),
  
  error: (message) => toast.error(message, {
    duration: 4000,
    position: 'top-right',
    style: {
      background: '#ef4444',
      color: '#fff',
    },
  }),
  
  info: (message) => toast(message, {
    duration: 3000,
    position: 'top-right',
    icon: 'ℹ️',
    style: {
      background: '#3b82f6',
      color: '#fff',
    },
  }),
  
  warning: (message) => toast(message, {
    duration: 3500,
    position: 'top-right',
    icon: '⚠️',
    style: {
      background: '#f59e0b',
      color: '#fff',
    },
  }),
};

export const notifyTaskActions = {
  added: () => notify.success('Tarefa adicionada com sucesso!'),
  updated: () => notify.success('Tarefa atualizada!'),
  deleted: () => notify.success('Tarefa excluída!'),
  completed: () => notify.success('Tarefa concluída! 🎉'),
  uncompleted: () => notify.info('Tarefa marcada como pendente'),
};
