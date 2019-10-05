const log = require('fancy-log');
const express = require('express');
const Game = require('../models/game');
const Room = require('../models/room');
const { requiredInfo } = require('../util/roles');

const router = express.Router();

const populate = [
  { path: 'users', select: '_id isConnected username displayName' },
  { path: 'host', select: '_id' },
  { path: 'missions', select: '_id failsRequired usersRequired users numberOfFails result userActions' },
];

router.get('/', async (_, res) => {
  try {
    const games = await Game.find({ active: true })
      .populate(populate).select('-roles').exec();

    res.status(200).send(games);
  } catch (error) {
    log.error(error);
    res.sendStatus(500);
  }
});

router.get('/:gameId', async (req, res) => {
  const { gameId } = req.params;

  try {
    const game = await Game.findById(gameId)
      .populate(populate).select('-roles').exec();

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
    const game = await Game.findById(gameId)
      .populate(populate).exec();

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
    const room = await Room.findById(roomId)
      .populate(populate).exec();

    if (!room) return res.status(400).send({ error: 'Room does not exist!' });

    const game = await Game.fromRoom(room);
    await Promise.all(game.users.map(u => u.setGameConnection(game._id)));
    await room.remove();

    req.io.emit('game started', game);
    res.status(201).send(game);
  } catch (error) {
    log.error(error);
    res.sendStatus(500);
  }
});

router.post('/restart', async (req, res) => {
  const { gameId } = req.body;
  if (!gameId) return res.status(400).send({ error: 'gameId is required!' });

  try {
    const game = await Game.findById(gameId).populate(populate).exec();
    if (!game) return res.status(400).send({ error: 'game does not exist!' });

    const newGame = await Game.fromGame(game);
    await Promise.all(game.users.map(u => u.setGameConnection(newGame._id)));

    game.active = false;
    await game.save();

    req.io.emit('game restarted', { _id: newGame._id, fromId: game._id });
    res.sendStatus(204);
  } catch (error) {
    log.error(error);
    res.sendStatus(500);
  }
});

router.put('/:gameId/end', async (req, res) => {
  const { gameId } = req.params;

  try {
    const game = await Game.findById(gameId).populate(populate).exec();
    if (!game) return res.status(404).send({ error: 'Not found!' });

    game.active = false;
    await game.save();
    
    await Promise.all(game.users.map(u => u.setGameConnection(null)));

    req.io.emit('game ended', game);
    res.sendStatus(204);
  } catch (error) {
    log.error(error);
    res.sendStatus(500);
  }
});

module.exports = router;