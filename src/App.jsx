import { useMemo, useState } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import Column from './components/Column'
import AddTaskForm from './components/AddTaskForm'
import TaskCard from './components/TaskCard'
import { useLocalStorage } from './hooks/useLocalStorage'
import { COLUMN_ORDER, COLUMN_META, createTask, seedTasks } from './boardConfig'
import './App.css'

function App() {
  const [tasks, setTasks] = useLocalStorage('kanban:tasks', seedTasks())
  const [query, setQuery] = useState('')
  const [activeTask, setActiveTask] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  )

  const filteredTasks = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return tasks
    return tasks.filter((t) => t.text.toLowerCase().includes(q))
  }, [tasks, query])

  const tasksByColumn = useMemo(() => {
    const map = {}
    for (const colId of COLUMN_ORDER) map[colId] = []
    for (const task of filteredTasks) {
      if (map[task.column]) map[task.column].push(task)
    }
    return map
  }, [filteredTasks])

  function addTask(text, priority) {
    setTasks((prev) => [...prev, createTask({ text, priority, column: 'todo' })])
  }

  function deleteTask(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  function editTask(id, newText) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, text: newText } : t)))
  }

  function changePriority(id, priority) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, priority } : t)))
  }

  function moveTask(id, destColumn) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, column: destColumn } : t)))
  }

  function findTask(id) {
    return tasks.find((t) => t.id === id)
  }

  function handleDragStart(event) {
    setActiveTask(findTask(event.active.id))
  }

  function handleDragOver(event) {
    const { active, over } = event
    if (!over) return

    const activeTaskItem = findTask(active.id)
    if (!activeTaskItem) return

    // Dropping directly over a column (empty space) vs. over another card.
    const overColumn = COLUMN_ORDER.includes(over.id) ? over.id : findTask(over.id)?.column

    if (!overColumn || overColumn === activeTaskItem.column) return

    setTasks((prev) => prev.map((t) => (t.id === active.id ? { ...t, column: overColumn } : t)))
  }

  function handleDragEnd(event) {
    const { active, over } = event
    setActiveTask(null)
    if (!over) return

    const activeTaskItem = findTask(active.id)
    if (!activeTaskItem) return

    const overIsColumn = COLUMN_ORDER.includes(over.id)
    const overColumn = overIsColumn ? over.id : findTask(over.id)?.column
    if (!overColumn) return

    setTasks((prev) => {
      const columnTasks = prev.filter((t) => t.column === overColumn)
      const oldIndex = columnTasks.findIndex((t) => t.id === active.id)
      const newIndex = overIsColumn
        ? columnTasks.length - 1
        : columnTasks.findIndex((t) => t.id === over.id)

      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return prev

      const reordered = arrayMove(columnTasks, oldIndex, newIndex)
      let reorderedIdx = 0

      // Reassemble the full task list, swapping in the new order only for
      // the affected column and leaving every other column untouched.
      return prev.map((t) => (t.column === overColumn ? reordered[reorderedIdx++] : t))
    })
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-title-block">
          <span className="app-eyebrow">Sprint 05 · React.js</span>
          <h1>Kanban Task Board</h1>
        </div>
        <input
          className="search-input"
          type="search"
          placeholder="Filter tasks…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Filter tasks"
        />
      </header>

      <AddTaskForm onAdd={addTask} />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <main className="board">
          {COLUMN_ORDER.map((colId) => (
            <Column
              key={colId}
              columnId={colId}
              title={COLUMN_META[colId].title}
              hint={COLUMN_META[colId].hint}
              tasks={tasksByColumn[colId]}
              onDelete={deleteTask}
              onEdit={editTask}
              onMove={moveTask}
              onPriorityChange={changePriority}
            />
          ))}
        </main>

        <DragOverlay>
          {activeTask ? (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <TaskCard
                task={activeTask}
                onDelete={() => {}}
                onEdit={() => {}}
                onMove={() => {}}
                onPriorityChange={() => {}}
              />
            </ul>
          ) : null}
        </DragOverlay>
      </DndContext>

      <footer className="app-footer">
        <span>{tasks.length} total tasks</span>
        <span className="dot">·</span>
        <span>Board state saved to your browser automatically</span>
      </footer>
    </div>
  )
}

export default App
