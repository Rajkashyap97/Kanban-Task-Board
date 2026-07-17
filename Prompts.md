# Prompts.md — AI-Assist Workflow Log

This file documents how AI assistance was used while building the Sprint 05
Kanban Task Board, per the assignment's engineering-context guidance to
"ask AI to explain useState concepts line-by-line rather than just
generating code for you."

## Workflow

1. **Scaffolding**: Initialized the project with `npm create vite@latest` using
   the `react` template (JS, not TS) as required — `create-react-app` is
   deprecated and was avoided.
2. **State design**: Modeled the board as a single flat array of task objects
   (`{ id, text, priority, column, createdAt }`) rather than one array per
   column. This keeps `useState`/`localStorage` sync simple, and each
   column's list is just `tasks.filter(t => t.column === columnId)`.
3. **Component architecture**: Split the UI into `App` (owns state) →
   `Column` (droppable + sortable container) → `TaskCard` (presentational +
   local editing state only). Data flows down via props; updates flow up
   via callback props (`onDelete`, `onEdit`, `onMove`, `onPriorityChange`),
   matching the "lifting state up" pattern from the sprint FAQ.
4. **Persistence**: Wrote a small reusable `useLocalStorage` hook that wraps
   `useState` + `useEffect`, so any component can opt into localStorage
   persistence without repeating boilerplate.
5. **Drag-and-drop**: Used `@dnd-kit/core` + `@dnd-kit/sortable` (per the
   sprint's suggested libraries) instead of `react-beautiful-dnd`, since
   dnd-kit is actively maintained and has first-class support for React 18/19.
   Kept the "Back / Next" move buttons alongside drag-and-drop rather than
   fully deprecating them, as a keyboard/click-accessible fallback for anyone
   who can't or doesn't want to drag.
6. **Styling**: Hand-written CSS (no Tailwind) using CSS custom properties
   for a small design-token system (blueprint/drafting-table palette) to
   keep the "engineering/architecture" framing from the assignment visible
   in the UI itself.

## Concepts explained to self during development

- **`useState`**: each call returns a `[value, setter]` pair scoped to a
  single component instance; calling the setter schedules a re-render with
  the new value rather than mutating in place.
- **Props vs. lifted state**: a child component never mutates its parent's
  state directly — it calls a function the parent handed it as a prop, and
  the parent decides how state actually changes.
- **Controlled inputs**: the add-task input and the inline-edit input are
  both controlled (`value` + `onChange` tied to state), which is why typing
  updates a JS variable, not the DOM, and why the DOM re-renders to match.
- **dnd-kit's model**: `DndContext` tracks drag state at the top level;
  `useSortable` (inside `TaskCard`) and `useDroppable` (inside `Column`)
  register each element as a drag source/drop target; `onDragEnd` is where
  actual state (task order/column) gets updated — dnd-kit itself never
  touches application data.
