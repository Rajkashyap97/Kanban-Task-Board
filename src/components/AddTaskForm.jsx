import { useState } from 'react'
import { PRIORITY_META } from '../boardConfig'

export default function AddTaskForm({ onAdd }) {
  const [text, setText] = useState('')
  const [priority, setPriority] = useState('medium')

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    onAdd(trimmed, priority)
    setText('')
    setPriority('medium')
  }

  return (
    <form className="add-task-form" onSubmit={handleSubmit}>
      <input
        className="add-task-input"
        type="text"
        placeholder="Draft a new task…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        aria-label="New task text"
      />
      <select
        className="priority-select"
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        aria-label="New task priority"
      >
        {Object.entries(PRIORITY_META).map(([key, meta]) => (
          <option key={key} value={key}>
            {meta.label}
          </option>
        ))}
      </select>
      <button className="add-btn" type="submit">
        + Add to To Do
      </button>
    </form>
  )
}
