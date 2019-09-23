const log = require('fancy-log');
const express = require('express');
const Room = require('../models/room');

const router = express.Router();

router.get('/', async (_, res) => {
  try {
    const rooms = await Room.find().populate('users').exec()
    res.status(200).send(rooms);
  } catch (error) {
    log.error(error);
    res.sendStatus(500);
  }
});

router.get('/:roomId', async (req, res) => {
  const { roomId } = req.params;

  try {
    const room = await Room.findById(roomId).populate('host users').exec();
    if (!room) res.status(404).send({ error: 'Not found!' });

    res.status(200).send(room);
  } catch (error) {
    log.error(error);
    res.sendStatus(500);
  }
});

router.post('/', async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).send('name is required!');

  try {
    const room = new Room({ name, host: req.user });
    await room.save();

    req.io.emit('room updated', room);
    res.status(201).send(room);
  } catch (error) {
    log.error(error);
    res.sendStatus(500);
  }
});

router.delete('/:roomId', async (req, res) => {
  const { roomId } = req.params;

  try {
    const room = await Room.findById(roomId).exec();
    if (!room) res.status(404).send({ error: 'Not found!' });

    await room.remove();

    req.io.emit('room deleted', room);
    res.status(200).send(room);
  } catch (error) {
    log.error(error);
    res.sendStatus(500);
  }
});

module.exports = router;