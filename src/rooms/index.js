const express = require('express');
const router = express.Router();

router.post('/', require('./create'));

module.exports = router;
