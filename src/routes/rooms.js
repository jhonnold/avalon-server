const express = require('express');
const Room = require('../models/room');
const User = require('../models/user');

const router = express.Router();

router.get('/', (_, res) => {
  Room.find().exec()
    .then(rooms => Promise.all([
      rooms,
      ...rooms.map(r => User.find({ roomConnection: r._id })
        .select('_id isConnected username displayName')
        .exec()
      )
    ]))
    .then(([rooms, ...usersPerRoom]) => {
      const serializedRooms = rooms.map((r, i) => ({
        ...r.toObject(),
        users: usersPerRoom[i],
      }));

      res.status(200).send(serializedRooms);
    });
});

router.get('/:roomId', (req, res) => {
  const { roomId } = req.params;
  
  Room.findById(roomId).exec()
    .then(room => Promise.all([
      room, 
      User.find({ roomConnection: room._id })
        .select('_id isConnected username displayName')
        .exec()
    ]))
    .then(([room, users]) => {
      const serializedRoom = {
        ...room.toObject(),
        users,
      };

      res.status(200).send(serializedRoom);
    })
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