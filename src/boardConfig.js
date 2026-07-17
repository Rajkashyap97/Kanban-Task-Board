// Single source of truth for column order + labels.
export const COLUMN_ORDER = ['todo', 'inProgress', 'done']

export const COLUMN_META = {
  todo: { title: 'To Do', hint: 'Not started' },
  inProgress: { title: 'In Progress', hint: 'Being worked on' },
  done: { title: 'Done', hint: 'Shipped' },
}

export const PRIORITY_META = {
  high: { label: 'High', order: 0 },
  medium: { label: 'Medium', order: 1 },
  low: { label: 'Low', order: 2 },
}

export function createTask({ text, priority = 'medium', column = 'todo' }) {
  return {
    id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    text,
    priority,
    column,
    createdAt: Date.now(),
  }
}

export function seedTasks() {
  return [
    createTask({ text: 'Wire up the Vite + React project', priority: 'high', column: 'done' }),
    createTask({ text: 'Design the three-column layout', priority: 'medium', column: 'done' }),
    createTask({ text: 'Build add / delete / move logic', priority: 'high', column: 'inProgress' }),
    createTask({ text: 'Hook state into localStorage', priority: 'medium', column: 'inProgress' }),
    createTask({ text: 'Wire up drag-and-drop with dnd-kit', priority: 'low', column: 'todo' }),
    createTask({ text: 'Record the QA demo video', priority: 'low', column: 'todo' }),
  ]
}
