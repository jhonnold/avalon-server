const express = require('express');
const router = express.Router();

router.get('/', require('./all'));
router.post('/', require('./create'));
router.post('/:roomId/join', require('./join'));
router.delete('/:roomId', require('./delete'));

module.exports = router;
