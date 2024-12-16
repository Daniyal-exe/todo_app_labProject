const express = require('express'); // Import Express
const db = require('./db'); // Import the database connection
const cors = require('cors');

const app = express(); // Create an Express application
const PORT = 3002; // Port for the server

app.use(cors());
// Middleware to parse JSON bodies
app.use(express.json());

// Route to test if the server is running
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// User Sign-Up
app.post('/signup', (req, res) => {
    const { name, email, password } = req.body;
  
    const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    db.query(query, [name, email, password], (err, results) => {
      if (err) {
        console.error('Error during user registration:', err); // Log the error to the console
        return res.status(500).json({ message: 'Error registering user.', error: err });
      }
      res.status(201).json({ message: 'User registered successfully.' });
    });
  });
  
  

// User Login
// Login Route
// In your server.js, update the login route
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
  }

  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
  db.query(query, [email, password], (err, results) => {
      if (err) {
          console.error('Error during login:', err);
          return res.status(500).json({ error: 'An error occurred during login.' });
      }

      if (results.length > 0) {
          console.log('User found:', results[0]); // Debug log
          res.status(200).json({ 
              message: 'Login successful!',
              userId: results[0].id // Make sure this matches your database column name
          });
      } else {
          res.status(401).json({ error: 'Invalid email or password.' });
      }
  });
});


// Add a To-Do Item
// Create Todo
// Create Todo
app.post('/todos', (req, res) => {
    const { userId, className, todoText } = req.body;
    console.log('Received todo request:', { userId, className, todoText }); // Debug log

    // Validation
    if (!userId || !className || !todoText) {
        console.log('Validation failed:', { userId, className, todoText });
        return res.status(400).json({ 
            message: "Missing required fields", 
            received: { userId, className, todoText } 
        });
    }

    // Ensure userId is a number
    const userIdNum = parseInt(userId, 10);
    console.log('Parsed userId:', userIdNum);

    const query = 'INSERT INTO todos (user_id, class_name, todo_text) VALUES (?, ?, ?)';
    console.log('Executing query with values:', [userIdNum, className, todoText]);
    
    db.query(query, [userIdNum, className, todoText], (err, result) => {
        if (err) {
            console.error('Database error details:', {
                code: err.code,
                sqlMessage: err.sqlMessage,
                sql: err.sql
            });
            return res.status(500).json({ 
                message: "Error creating todo", 
                error: err.message 
            });
        }
        
        console.log('Query successful, result:', result);
        res.status(201).json({ 
            message: "Todo created successfully",
            todoId: result.insertId
        });
    });
});

// Get Todos
app.get('/todos/:userId', (req, res) => {
  const { userId } = req.params;
  console.log('Fetching todos for user:', userId); // Debug log

  const query = 'SELECT * FROM todos WHERE user_id = ?';
  
  db.query(query, [userId], (err, results) => {
      if (err) {
          console.error('Error fetching todos:', err);
          return res.status(500).json({ 
              message: "Error fetching todos", 
              error: err.message 
          });
      }
      
      console.log('Fetched todos:', results);
      res.status(200).json(results);
  });
});

// Update Todo
app.put('/todos/:id', (req, res) => {
  const { id } = req.params;
  const { className, todoText } = req.body;
  console.log('Updating todo:', { id, className, todoText }); // Debug log

  const query = 'UPDATE todos SET class_name = ?, todo_text = ? WHERE id = ?';
  
  db.query(query, [className, todoText, id], (err, result) => {
      if (err) {
          console.error('Error updating todo:', err);
          return res.status(500).json({ 
              message: "Error updating todo", 
              error: err.message 
          });
      }
      
      if (result.affectedRows === 0) {
          return res.status(404).json({ message: "Todo not found" });
      }
      
      res.status(200).json({ message: "Todo updated successfully" });
  });
});

// Delete Todo
app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;
  console.log('Deleting todo:', id); // Debug log

  const query = 'DELETE FROM todos WHERE id = ?';
  
  db.query(query, [id], (err, result) => {
      if (err) {
          console.error('Error deleting todo:', err);
          return res.status(500).json({ 
              message: "Error deleting todo", 
              error: err.message 
          });
      }
      
      if (result.affectedRows === 0) {
          return res.status(404).json({ message: "Todo not found" });
      }
      
      res.status(200).json({ message: "Todo deleted successfully" });
  });
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
