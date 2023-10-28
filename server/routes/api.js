var express = require('express');
var router = express.Router();
const maker = require('./maker');

app.use('/api/maker', maker);

module.exports = router;
