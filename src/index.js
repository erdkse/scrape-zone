const express = require('express');
const cors = require('cors');
const ResultController = require('./controllers/result.controller');

require('../config/db');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.get('/', (req, res) => {
  res.status(200).json({ message: 'App is running!' });
});

app.get('/search', ResultController.checkResult);

app.all('*', (req, res) => {
  res.status(404).json({ status: false, message: 'Not found' });
});

app.listen(port, () => console.log(`App is running on ${port}`));
