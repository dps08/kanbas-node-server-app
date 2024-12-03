let todos = [
  { id: 1, title: "Task 1", completed: false },
  { id: 2, title: "Task 2", completed: true },
  { id: 3, title: "Task 3", completed: false },
  { id: 4, title: "Task 4", completed: true },
];

export default function WorkingWithArrays(app) {
  // Enable JSON parsing
  app.use((req, res, next) => {
    if (req.headers["content-type"] === "application/json") {
      next();
    } else {
      res.status(400).send("Invalid Content-Type header.");
    }
  });

  // Retrieve the entire array
  app.get("/lab5/todos", (req, res) => {
    const { completed } = req.query;
    if (completed !== undefined) {
      const completedBool = completed === "true";
      const completedTodos = todos.filter((t) => t.completed === completedBool);
      res.json(completedTodos);
      return;
    }
    res.json(todos);
  });

  // Retrieve an item by ID
  app.get("/lab5/todos/:id", (req, res) => {
    const { id } = req.params;
    const todo = todos.find((t) => t.id === parseInt(id));
    if (!todo) {
      res.status(404).json({ error: `Todo with ID ${id} not found.` });
      return;
    }
    res.json(todo);
  });

  // Create a new item (GET for backward compatibility)
  app.get("/lab5/todos/create", (req, res) => {
    const newTodo = { id: new Date().getTime(), title: "New Task", completed: false };
    todos.push(newTodo);
    res.json(todos);
  });

  // Create a new item (POST method)
  app.post("/lab5/todos", (req, res) => {
    const newTodo = { ...req.body, id: new Date().getTime() };
    todos.push(newTodo);
    res.json(newTodo);
  });

  // Delete an item by ID (GET for backward compatibility)
  app.get("/lab5/todos/:id/delete", (req, res) => {
    const { id } = req.params;
    const todoIndex = todos.findIndex((t) => t.id === parseInt(id));
    if (todoIndex !== -1) {
      todos.splice(todoIndex, 1);
    }
    res.json(todos);
  });

  // Delete an item by ID (DELETE method)
  app.delete("/lab5/todos/:id", (req, res) => {
    const { id } = req.params;
    const todoIndex = todos.findIndex((t) => t.id === parseInt(id));
    if (todoIndex === -1) {
      res.status(404).json({ message: `Unable to delete Todo with ID ${id}` });
      return;
    }
    todos.splice(todoIndex, 1);
    res.sendStatus(200);
  });

  // Update an item by ID (PUT method)
  app.put("/lab5/todos/:id", (req, res) => {
    const { id } = req.params;
    const todoIndex = todos.findIndex((t) => t.id === parseInt(id));
    if (todoIndex === -1) {
      res.status(404).json({ message: `Unable to update Todo with ID ${id}` });
      return;
    }
    todos[todoIndex] = { ...todos[todoIndex], ...req.body };
    res.sendStatus(200);
  });

  // Update title, description, or completed using GET (for backward compatibility)
  app.get("/lab5/todos/:id/:field/:value", (req, res) => {
    const { id, field, value } = req.params;
    const todo = todos.find((t) => t.id === parseInt(id));
    if (!todo) {
      res.status(404).json({ error: `Todo with ID ${id} not found.` });
      return;
    }
    if (field === "completed") {
      todo[field] = value === "true";
    } else {
      todo[field] = value;
    }
    res.json(todos);
  });
}
