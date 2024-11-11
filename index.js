const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // To parse JSON bodies
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies

// Basic route
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Example of another route
app.get('/api', (req, res) => {
    res.json({ message: 'Welcome to the API' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
