const express = require('express');
const router = express.Router();

router.get('/:gameId', require('./show'));

module.exports = router;