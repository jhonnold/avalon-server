const log = require('fancy-log');
const express = require('express');
const Game = require('../models/game');
const Room = require('../models/room');
const { requiredInfo } = require('../util/roles');
const emitter = require('../events/emitter');

const router = express.Router();

const populate = [
  { path: 'users', select: '_id isConnected username displayName' },
  { path: 'host', select: '_id' },
];

router.get('/', async (_, res) => {
  try {
    const games = await Game.find().populate(populate).select('-roles').exec();
    res.status(200).send(games);
  } catch (error) {
    log.error(error);
    res.sendStatus(500);
  }
});

router.get('/:gameId', async (req, res) => {
  const { gameId } = req.params;

  try {
    const game = await Game.findById(gameId).populate(populate).select('-roles').exec();
    if (!game) throw new Error({ error: 'Not Found!' });

    res.status(200).send(game);
  } catch (error) {
    log.error(error);
    res.sendStatus(500);
  }
});

router.get('/:gameId/me', async (req, res) => {
  const { gameId } = req.params;

  try {
    const game = await Game.findById(gameId).populate(populate).exec();
    if (!game) throw new Error({ error: 'Not Found!' });

    const info = requiredInfo(req.user._id, game.roles, game.users);
    res.status(200).send(info);
  } catch (error) {
    log.error(error);
    res.sendStatus(500);
  }
});

router.post('/', async (req, res) => {
  const { roomId } = req.body;
  if (!roomId) return res.status(400).send('roomId is required!');

  try {
    const room = await Room.findById(roomId).populate('host users').exec();
    if (!room) return res.status(404).send({ error: 'Room not found!' });

    const game = await Game.fromRoom(room);
    await Promise.all(game.users.map(u => u.setGameConnection(game._id)));
    await room.remove();
    
    emitter.emit('game started', game._id);
    res.status(201).send(game);
  } catch (error) {
    log.error(error);
    res.sendStatus(500);
  }
});

router.put('/:gameId/restart', async (req, res) => {
  const { gameId } = req.params;

  try {
    const game = await Game.findById(gameId).populate(populate).exec();
    if (!game) throw new Error({ error: 'Not Found!' });

    await game.restart();
    emitter.emit('game restarted', game._id);
  } catch (error) {
    log.error(error);
    res.sendStatus(500);
  }
});

router.delete('/:gameId', async (req, res) => {
  const { gameId } = req.params;

  try {
    const game = await Game.findById(gameId).populate(populate).exec();
    if (!game) return res.status(404).send({ error: 'Not found!' });

    await Promise.all(game.users.map(u => u.setGameConnection(null)));
    await game.remove();
    res.sendStatus(200);
  } catch (error) {
    log.error(error);
    res.sendStatus(500);
  }
});

module.exports = router;