const express = require('express');
const Room = require('../models/room');

const router = express.Router();

router.get('/', (_, res) => {
  Room.find().exec()
    .then(rooms => Promise.all(rooms.map(r => r.serialize())))
    .then(serializedRooms => {
      res.status(200).send(serializedRooms);
    });
});

router.get('/:roomId', (req, res) => {
  const { roomId } = req.params;
  
  Room.findById(roomId).exec()
    .then(room => room.serialize())
    .then(serializedRoom => {
      res.status(200).send(serializedRoom);
    })
    .catch(error => res.status(500).send(error));
});

router.post('/', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).send('name is required!');

  const room = new Room({ name, host: req.user });
  room.save()
    .then(room => room.serialize())
    .then(room => {
      res.status(201).send(room);
    })
    .catch(console.error);
});

router.delete('/:roomId', (req, res) => {
  const { roomId } = req.params;

  Room.findById(roomId).exec()
    .then(room => room.remove())
    .then(room => res.status(200).send(room))
    .catch(error => res.status(500).send(error));
});

module.exports = router;