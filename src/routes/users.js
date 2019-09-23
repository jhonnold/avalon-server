const log = require('fancy-log');
const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/user');
const Room = require('../models/room');

const router = express.Router();

router.get('/me', auth, (req, res) => {
  res.status(200).send(req.user);
});

router.post('/', async (req, res) => {
  const { username, password, displayName } = req.body;
  if (!username || !password || !displayName) {
    return res.status(400).send({ error: 'username, password, and displayName are required!'});
  }

  try {
    const user = new User({ username, password, displayName });
    await user.save();

    res.status(201).send({ user, token: user.generateToken() });
  } catch (error) {
    log.error(error);

    if (error.code === 11000) res.status(400).send({ error: 'username is taken!' });
    else res.sendStatus(500);
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.login(username, password);
    if (!user) return res.status(401).status({ error: 'Login Failed!' });

    res.status(200).send({ user, token: user.generateToken() });
  } catch (error) {
    log.error(error);
    
    if (error.message === 'Incorrect Password!') res.status(401).send({ error: 'Login Failed!' });
    else if (error.message === 'Unknown user!') res.status(400).send({ error: 'Unknown user! '});
    else res.sendStatus(500);
  }
});

router.put('/join-room', auth, async (req, res) => {
  const { user } = req;
  const { roomId } = req.body;

  if (!roomId) return res.status(400).send('roomId is required!');

  try {
    const room = await Room.findById(roomId).exec();
    if (!room) return res.status(404).send({ error: 'Room not found!' });
    
    await user.setRoomConnection(room);
    await room.addUser(user);
    
    res.status(200).send(user);
  } catch (error) {
    log.error(error);
    res.sendStatus(500);
  }
});

router.put('/leave-room', auth, async (req, res) => {
  const { user } = req;
  const { roomConnection } = user;
  if (!roomConnection) return res.status(400).send('not in a room!');

  try {
    await user.setRoomConnection(null);
    const room = await Room.findById(roomConnection).exec();
    await room.removeUser(user);

    res.status(200).send(user);
  } catch (error) {
    log.error(error);

    res.sendStatus(500);
  }
});

module.exports = router;