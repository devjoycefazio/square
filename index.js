// app.mjs

import express from 'express';
import cors from 'cors';
const app = express();
const port = 3000;


app.use(cors());

app.get('/', async (req, res) => {
  try {
    const apiVersion = 'v1'; // Replace with the actual API version
    const cursor = req.query.cursor || ''; // Add query parameters if needed
    const filter = req.query.filter || ''; // Add query parameters if needed
    const sortDirection = req.query.sortDirection || ''; // Add query parameters if needed
    const sortField = req.query.sortField || ''; // Add query parameters if needed

    const apiUrl = `https://api.squarespace.com/1.0/profiles/?cursor=${cursor}&filter=${filter}&sortDirection=${sortDirection}&sortField=${sortField}`;

    // Make a GET request to the Squarespace API using fetch
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        // Add any required headers, such as authentication headers
        'Authorization': 'Bearer 16689809-c1ad-4477-be83-56a73046f651',
      },
    });

    if (response.ok) {
      const data = await response.json();
      // Return the API response
      res.json(data);
    } else {
      // Handle non-200 responses
      res.status(response.status).json({ error: 'API request failed' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});