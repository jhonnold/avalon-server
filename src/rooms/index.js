const express = require('express');
const router = express.Router();

router.get('/', require('./all'));
router.post('/', require('./create'));
router.put('/:roomId/join', require('./join'));
router.put('/:roomId/leave', require('./leave'));
router.delete('/:roomId', require('./delete'));

module.exports = router;
