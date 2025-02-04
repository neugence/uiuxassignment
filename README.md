# Task Management System

This project is a **Task Management System** built with **React and Vite**. It allows users to create, edit, and manage tasks with a modal window, track task timelines in an interactive dashboard, and efficiently filter, sort, and search through a large dataset.

## Features

- **Create, edit, and manage tasks** with a **modal window**.
- **Track task timelines** in an interactive dashboard.
- **Filter, sort, and search** through a **large dataset** efficiently.
- **Responsive UI** for seamless user experience.

## Project Structure

```
frontend/
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── public/
├── README.md
├── src/
│   ├── App.jsx
│   ├── assets/
│   ├── components/
│   │   ├── Dashboard.jsx
│   │   └── Taskboard.jsx
│   ├── index.css
│   ├── main.jsx
│   ├── redux/
│   │   ├── store.js
│   │   └── taskSlice.js
├── vite.config.js
```

## Getting Started

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** or **yarn**

### Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/your-username/task-management-system.git
   cd task-management-system/frontend
   ```

2. **Install dependencies:**

   ```sh
   npm install
   # or
   yarn install
   ```

### Running the Development Server

To start the development server, run:

```sh
npm run dev
# or
yarn dev
```

### Building for Production

To build the project for production, run:

```sh
npm run build
# or
yarn build
```

### Linting

To lint the project, run:

```sh
npm run lint
# or
yarn lint
```

## Usage

### Taskboard
The **Taskboard** component allows users to:

- Add new tasks with a title, start date, and end date.
- Add subtasks to existing tasks.
- Edit and delete tasks and subtasks.
- Search for tasks and subtasks.
- Drag and drop tasks to reorder them.

### Dashboard
The **Dashboard** component provides a visual timeline of tasks, showing their start and end dates. It also allows users to navigate back to the **Taskboard**.

## State Management

The project uses **Redux Toolkit** for state management and **redux-persist** for persisting the state across sessions. The state is managed in the `src/redux` directory, with the main store configuration in `store.js` and task-related actions and reducers in `taskSlice.js`.

## Contributing

Contributions are welcome! Please **fork** the repository and create a **pull request** with your changes.

## License

This project is licensed under the **MIT License**.
