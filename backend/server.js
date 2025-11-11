const express = require('express');
const cors = require('cors');
const bodyParser = require('express').json;
const { init } = require('./db');

const app = express();
app.use(cors());
app.use(bodyParser());
init();

app.use('/api/users', require('./routes/users'));
app.use('/api/courses', require('./routes/courses'));

const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
