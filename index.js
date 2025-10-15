const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// --- Database Connection ---
// Docker Compose will provide these environment variables
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: 'db', // The service name from docker-compose.yml
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});

// --- API Routes ---
app.get('/', (req, res) => {
  res.send('Hello from your Express app in Docker!');
});

// Route to check database connection
app.get('/db-test', async (req, res) => {
  try {
    const time = await pool.query('SELECT NOW()');
    res.send(`Database time is: ${time.rows[0].now}`);
  } catch (error) {
    res.status(500).send('Failed to connect to the database: ' + error);
  }
});

// Route to call a free public API
app.get('/public-api', async (req, res) => {
  try {
    const response = await fetch('https://api.coindesk.com/v1/bpi/currentprice.json');
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).send('Failed to fetch from public API: ' + error);
  }
});


app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});