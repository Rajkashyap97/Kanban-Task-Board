import { useState, useRef, useEffect } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { COLUMN_ORDER, COLUMN_META, PRIORITY_META } from '../boardConfig'

export default function TaskCard({ task, onDelete, onEdit, onMove, onPriorityChange }) {
  const [isEditing, setIsEditing] = useState(false)
  const [draftText, setDraftText] = useState(task.text)
  const inputRef = useRef(null)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [isEditing])

  function commitEdit() {
    const trimmed = draftText.trim()
    if (trimmed.length === 0) {
      setDraftText(task.text)
      setIsEditing(false)
      return
    }
    onEdit(task.id, trimmed)
    setIsEditing(false)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') commitEdit()
    if (e.key === 'Escape') {
      setDraftText(task.text)
      setIsEditing(false)
    }
  }

  const currentIndex = COLUMN_ORDER.indexOf(task.column)
  const canMoveBack = currentIndex > 0
  const canMoveForward = currentIndex < COLUMN_ORDER.length - 1

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`task-card priority-${task.priority}${isDragging ? ' is-dragging' : ''}`}
    >
      <div className="task-card-top">
        <span className="drag-handle" {...attributes} {...listeners} title="Drag to move">
          ⠿
        </span>

        <select
          className="priority-select"
          value={task.priority}
          onChange={(e) => onPriorityChange(task.id, e.target.value)}
          aria-label="Priority"
        >
          {Object.entries(PRIORITY_META).map(([key, meta]) => (
            <option key={key} value={key}>
              {meta.label}
            </option>
          ))}
        </select>

        <button
          className="icon-btn delete-btn"
          onClick={() => onDelete(task.id)}
          aria-label="Delete task"
          title="Delete task"
        >
          ✕
        </button>
      </div>

      {isEditing ? (
        <input
          ref={inputRef}
          className="task-edit-input"
          value={draftText}
          onChange={(e) => setDraftText(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <p className="task-text" onClick={() => setIsEditing(true)} title="Click to edit">
          {task.text}
        </p>
      )}

      <div className="task-card-bottom">
        <button
          className="move-btn"
          disabled={!canMoveBack}
          onClick={() => onMove(task.id, COLUMN_ORDER[currentIndex - 1])}
          title={canMoveBack ? `Move to ${COLUMN_META[COLUMN_ORDER[currentIndex - 1]].title}` : ''}
        >
          ← Back
        </button>
        <button
          className="move-btn"
          disabled={!canMoveForward}
          onClick={() => onMove(task.id, COLUMN_ORDER[currentIndex + 1])}
          title={canMoveForward ? `Move to ${COLUMN_META[COLUMN_ORDER[currentIndex + 1]].title}` : ''}
        >
          Next →
        </button>
      </div>
    </li>
  )
}
