import React, { useState } from 'react';

const TaskEditor = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dependencies, setDependencies] = useState([]);
  const [tasks, setTasks] = useState([]); // Local state for mock tasks

  const handleSaveTask = () => {
    const newTask = {
      id: tasks.length + 1,
      title,
      description,
      dependencies,
    };
    setTasks([...tasks, newTask]);
    setTitle('');
    setDescription('');
    setDependencies([]);
    alert('Task saved locally!');
  };

  return (
    <div>
      <h2>Task Editor</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSaveTask();
        }}
      >
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="text"
          placeholder="Dependencies (comma-separated IDs)"
          value={dependencies.join(',')}
          onChange={(e) =>
            setDependencies(e.target.value.split(',').map((id) => id.trim()))
          }
        />
        <button type="submit">Save Task</button>
      </form>

      <h3>Mock Tasks</h3>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.title} (Dependencies: {task.dependencies.join(', ') || 'None'})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskEditor;
