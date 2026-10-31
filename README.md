# TaskFlow - Easy Kanban Board

A beginner-friendly React project for managing tasks.

## Features
- Add, edit and delete tasks
- Three columns: Todo, In Progress and Completed
- Change a task's status
- Search tasks by title
- Filter tasks by priority
- Save tasks in browser LocalStorage
- Responsive layout for desktop and mobile

## Run locally
1. Install Node.js.
2. Open this folder in VS Code.
3. Open the terminal and run:

   ```bash
   npm install
   npm run dev
   ```

4. Open the local URL shown in the terminal (usually http://localhost:5173).

## Main files
- `src/App.jsx` contains the app state and task operations.
- `src/App.css` contains the styling and responsive layout.
- `src/main.jsx` starts the React application.

## Deploy
Push this folder to a GitHub repository, import the repository into Vercel, and use the default Vite settings:
- Build command: `npm run build`
- Output directory: `dist`
