# Kanban Task Board
## 🚀 Live Demo

**Live Website:** https://kanban-task-board-mu-snowy.vercel.app/

## 📂 GitHub Repository

https://github.com/Rajkashyap97/Kanban-Task-Board

A Trello-style task board built with **React 19 + Vite**, covering all three
sprint phases:

- **Phase 1 (MVP):** 3-column layout (To Do / In Progress / Done), add task,
  delete task, move task between columns.
- **Phase 2 (Polish):** click-to-edit inline text, a priority selector
  (High/Medium/Low) with colored left-border styling per card, and full
  state persistence to `localStorage` (survives hard refresh).
- **Phase 3 (Advanced):** drag-and-drop between and within columns using
  `@dnd-kit`, plus a live search box that filters all three columns as you type.

No API keys, backend, or database — everything lives in client-side React
state (`useState`) mirrored into `localStorage`.

---

## 1. Requirements

- [Node.js](https://nodejs.org/) v18 or newer (v20 recommended)
- npm (comes bundled with Node)

Check your versions:

```bash
node -v
npm -v
```

---

## 2. Run it locally

```bash
# 1. Unzip this project, then move into the folder
cd kanban-board

# 2. Install dependencies (only needed once, or after pulling new changes)
npm install

# 3. Start the dev server
npm run dev
```

Vite will print a local URL, typically:

```
Local:   http://localhost:5173/
```

Open that link in your browser. The dev server has hot-reload — edit any
file in `src/` and the browser updates instantly.

To stop the server, press `Ctrl + C` in the terminal.

---

## 3. Build for production

```bash
npm run build
```

This outputs a static, optimized build into the `dist/` folder. To sanity-check
the production build locally before deploying:

```bash
npm run preview
```

---

## 4. Deploy to Vercel

1. Push this project to a **public GitHub repository** (see below — `node_modules`
   is already excluded via `.gitignore`, so `git add .` is safe).
2. Go to [vercel.com](https://vercel.com) and log in.
3. Click **Add New Project** → **Import** your GitHub repo.
4. Vercel auto-detects the Vite framework preset — leave the defaults:
   - Build Command: `npm run build` (or `vite build`)
   - Output Directory: `dist`
5. Click **Deploy**. Vercel gives you a live `https://your-project.vercel.app`
   URL once the build finishes.

(Netlify works the same way: build command `npm run build`, publish
directory `dist`.)

---

## 5. Pushing to GitHub

```bash
git init
git add .
git commit -m "Kanban Task Board - Sprint 05"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

`node_modules/` is already listed in `.gitignore`, so it won't be pushed.
Anyone who clones the repo just needs to run `npm install` before `npm run dev`.

---

## 6. Project structure

```
kanban-board/
├── index.html
├── package.json
├── src/
│   ├── main.jsx              # React entry point
│   ├── App.jsx                # Top-level state, drag-and-drop wiring, search
│   ├── App.css                 # Layout + component styling
│   ├── index.css                # Design tokens, global resets, fonts
│   ├── boardConfig.js            # Column + priority config, task factory, seed data
│   ├── hooks/
│   │   └── useLocalStorage.js     # Generic localStorage-backed useState
│   └── components/
│       ├── Column.jsx               # Droppable column + sortable list
│       ├── TaskCard.jsx              # Card: inline edit, priority, delete, move
│       └── AddTaskForm.jsx            # New task input + priority picker
└── Prompts.md                # AI-assist workflow log for this sprint
```

## 7. How data flows (for the QA video)

- All tasks live in one flat array in `App.jsx`, each with an `id`, `text`,
  `priority`, and `column` field.
- `useLocalStorage` wraps that array so every change is written to
  `window.localStorage` automatically — reload the page and the board is
  exactly as you left it.
- **Parent → child:** `App.jsx` passes the filtered task list down to each
  `Column`, which passes each task down to `TaskCard` (props).
- **Child → parent:** `TaskCard` calls functions passed down as props
  (`onDelete`, `onEdit`, `onMove`, `onPriorityChange`) to update state that
  lives in `App.jsx` — "lifting state up."
- Drag-and-drop is handled by `@dnd-kit/core` + `@dnd-kit/sortable`:
  `DndContext` in `App.jsx` listens for drag events and updates each task's
  `column` (and order) in state; the DOM re-renders because React reacts to
  the state change, not because any element was manually moved.
