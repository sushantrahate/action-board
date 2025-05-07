// Define all sections
const sections = ['todo', 'notes', 'priorities', 'calls', 'tomorrow'];

// Initialize data structures
let tasks = {};

// Load from localStorage or initialize
sections.forEach((section) => {
  tasks[section] = JSON.parse(localStorage.getItem(section)) || {
    active: [],
    completed: [],
  };
});

// Enable Enter key to add tasks
sections.forEach((section) => {
  const input = document.getElementById(`${section}-input`);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      addTask(section);
    }
  });
});

// Save to localStorage
function saveTasks() {
  sections.forEach((section) => {
    localStorage.setItem(section, JSON.stringify(tasks[section]));
  });
}

// Render all sections
function renderAll() {
  sections.forEach((section) => {
    renderSection(section);
  });
}

// Render a specific section
function renderSection(section) {
  const activeList = document.getElementById(`${section}-list`);
  const completedList = document.getElementById(`${section}-completed-list`);
  const completedSection = document.getElementById(
    `${section}-completed-section`
  );

  // Clear existing items
  activeList.innerHTML = '';
  completedList.innerHTML = '';

  // Render active tasks
  tasks[section].active.forEach((task, index) => {
    const li = createTaskItem(section, task, index, false);
    activeList.appendChild(li);
  });

  // Render completed tasks
  tasks[section].completed.forEach((task, index) => {
    const li = createTaskItem(section, task, index, true);
    completedList.appendChild(li);
  });

  // Show or hide completed section
  completedSection.classList.toggle(
    'hidden',
    tasks[section].completed.length === 0
  );
}

// Create a task item
function createTaskItem(section, text, index, isCompleted) {
  const li = document.createElement('li');
  li.className = 'flex justify-between items-center bg-[#fffbc3] p-2 rounded';

  const span = document.createElement('span');
  span.textContent = text;
  span.className = isCompleted
    ? 'line-through text-gray-500 flex-grow'
    : 'flex-grow';

  const controls = document.createElement('div');
  controls.className = 'ml-4 flex items-center';

  const completeBtn = document.createElement('button');
  completeBtn.textContent = isCompleted ? 'Undo' : 'Done';
  completeBtn.className = 'text-sm text-green-500 mr-2';
  completeBtn.onclick = () => toggleComplete(section, index, isCompleted);
  controls.appendChild(completeBtn);

  if (!isCompleted) {
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.className = 'text-sm text-blue-500 mr-2';
    editBtn.onclick = () => editTask(section, index);
    controls.appendChild(editBtn);
  }

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.className = 'text-sm text-red-500';
  deleteBtn.onclick = () => deleteTask(section, index, isCompleted);
  controls.appendChild(deleteBtn);

  li.appendChild(span);
  li.appendChild(controls);

  return li;
}

// Add a new task
function addTask(section) {
  const input = document.getElementById(`${section}-input`);
  const value = input.value.trim();
  if (value) {
    tasks[section].active.push(value);
    input.value = '';
    saveTasks();
    renderSection(section);
  }
}

// Edit a task
function editTask(section, index) {
  const newValue = prompt('Edit task', tasks[section].active[index]);
  if (newValue !== null) {
    tasks[section].active[index] = newValue.trim();
    saveTasks();
    renderSection(section);
  }
}

// Delete a task
function deleteTask(section, index, isCompleted) {
  if (isCompleted) {
    tasks[section].completed.splice(index, 1);
  } else {
    tasks[section].active.splice(index, 1);
  }
  saveTasks();
  renderSection(section);
}

// Toggle task completion
function toggleComplete(section, index, isCompleted) {
  if (isCompleted) {
    const task = tasks[section].completed.splice(index, 1)[0];
    tasks[section].active.push(task);
  } else {
    const task = tasks[section].active.splice(index, 1)[0];
    tasks[section].completed.push(task);
  }
  saveTasks();
  renderSection(section);
}

// Initial render
renderAll();
