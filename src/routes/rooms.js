const log = require('fancy-log');
const express = require('express');
const Room = require('../models/room');

const router = express.Router();

router.get('/', (_, res) => {
  Room.find().exec()
    .then(rooms => Promise.all(rooms.map(r => r.serialize())))
    .then(serializedRooms => {
      res.status(200).send(serializedRooms);
    })
    .catch(error => {
      log.error(error);
      res.sendStatus(500);
    });
});

router.get('/:roomId', (req, res) => {
  const { roomId } = req.params;
  
  Room.findById(roomId).populate('host').exec()
    .then(room => room.serialize())
    .then(serializedRoom => {
      res.status(200).send(serializedRoom);
    })
    .catch(error => {
      log.error(error);
      res.sendStatus(500);
    });
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
    .catch(error => {
      log.error(error);
      res.sendStatus(500);
    });
});

router.delete('/:roomId', (req, res) => {
  const { roomId } = req.params;

  Room.findById(roomId).exec()
    .then(room => room.remove())
    .then(room => res.status(200).send(room))
    .catch(error => {
      log.error(error);
      res.sendStatus(500);
    });
});

module.exports = router;