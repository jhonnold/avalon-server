const express = require('express');
const Room = require('../models/room');

const router = express.Router();

router.get('/', (_, res) => {
  Room.find().exec()
    .then(rooms => {
      res.status(200).send(rooms);
    });
});

router.get('/:roomId', (req, res) => {
  const { roomId } = req.params;
  
  Room.findById(roomId).exec()
    .then(room => res.status(200).send(room))
    .catch(error => res.status(500).send(error));
});

router.post('/', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).send('name is required!');

  const room = new Room({ name, host: req.user });
  room.save()
    .then(room => res.status(201).send(room))
    .catch(error => res.status(500).send(error));
});

router.delete('/:roomId', (req, res) => {
  const { roomId } = req.params;

  Room.findByIdAndRemove(roomId).exec()
    .then(room => res.status(200).send(room))
    .catch(error => res.status(500).send(error));
});

module.exports = router;