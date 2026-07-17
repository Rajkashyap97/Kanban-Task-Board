import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import TaskCard from './TaskCard'

export default function Column({ columnId, title, hint, tasks, onDelete, onEdit, onMove, onPriorityChange }) {
  const { setNodeRef, isOver } = useDroppable({ id: columnId })

  return (
    <section className={`column${isOver ? ' column-over' : ''}`} aria-label={title}>
      <header className="column-header">
        <h2>{title}</h2>
        <span className="column-count">{tasks.length}</span>
      </header>
      <p className="column-hint">{hint}</p>

      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <ul ref={setNodeRef} className="column-list">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={onDelete}
              onEdit={onEdit}
              onMove={onMove}
              onPriorityChange={onPriorityChange}
            />
          ))}
          {tasks.length === 0 && <li className="empty-slot">Drop a task here</li>}
        </ul>
      </SortableContext>
    </section>
  )
}
