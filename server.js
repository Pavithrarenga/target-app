const express = require('express');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');

const app = express();
const PORT = 3000;
const TODOS_FILE = path.join(__dirname, 'data', 'todos.json');

app.use(express.json());
app.use(express.static('public'));

// Read todos from file
const readTodos = () => {
  try {
    const data = fs.readFileSync(TODOS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Write todos to file
const writeTodos = (todos) => {
  fs.writeFileSync(TODOS_FILE, JSON.stringify(todos, null, 2));
};

// GET all todos
app.get('/api/todos', (req, res) => {
  const todos = readTodos();
  res.json(todos);
});

// POST new todo
app.post('/api/todos', (req, res) => {
  const todos = readTodos();
  const newTodo = {
    id: Date.now(),
    text: req.body.text,
    completed: false
  };
  todos.push(newTodo);
  writeTodos(todos);
  res.json(newTodo);
});

// PUT update todo
app.put('/api/todos/:id', (req, res) => {
  const todos = readTodos();
  const todoId = parseInt(req.params.id);
  const todoIndex = todos.findIndex(todo => todo.id === todoId);
  
  if (todoIndex === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  
  todos[todoIndex] = { ...todos[todoIndex], ...req.body };
  writeTodos(todos);
  res.json(todos[todoIndex]);
});

// DELETE todo
app.delete('/api/todos/:id', (req, res) => {
  const todos = readTodos();
  const todoId = parseInt(req.params.id);
  const filteredTodos = todos.filter(todo => todo.id !== todoId);
  
  if (filteredTodos.length === todos.length) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  
  writeTodos(filteredTodos);
  res.json({ message: 'Todo deleted' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});