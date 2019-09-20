const log = require('fancy-log');
const express = require('express');
const Game = require('../models/game');
const { requiredInfo } = require('../util/roles');
const emitter = require('../events/emitter');

const router = express.Router();

router.get('/', (_, res) => {
  const populate = [
    { path: 'users', select: '_id isConnected username displayName' },
    { path: 'host', select: '_id' },
  ];

  Game.find()
    .populate(populate)
    .select('-roles')
    .exec()
    .then(games => {
      res.status(200).send(games);
    })
    .catch(error => {
      log.error(error);
      res.sendStatus(500);
    })
})

router.get('/:gameId', (req, res) => {
  const { gameId } = req.params;

  const populate = [
    { path: 'users', select: '_id isConnected username displayName' },
    { path: 'host', select: '_id' },
  ];

  Game.findById(gameId)
    .populate(populate)
    .select('-roles')
    .exec()
    .then(game => {
      if (!game) throw new Error({ error: 'Not Found!' });

      res.status(200).send(game);
    })
    .catch(error => {
      log.error(error);
      res.sendStatus(500);
    });
});

router.get('/:gameId/me', (req, res) => {
  const { gameId } = req.params;

  Game.findById(gameId)
    .populate('users')
    .exec()
    .then(game => {
      if (!game) throw new Error('Not Found!');

      const info = requiredInfo(req.user._id, game.roles, game.users);
      res.status(200).send(info);
    })
    .catch(error => {
      log.error(error);
      res.sendStatus(500);
    })
});

router.post('/', (req, res) => {
  const { roomId } = req.body;
  if (!roomId) return res.status(400).send('roomId is required!');

  Game.fromRoomId(roomId)
    .then(game => Promise.all([
      game.toObject(),
      ...game.users.map(u => u.setGameConnection(game)),
    ]))
    .then(([game]) => {
      delete game['roles']; // Don't want to reveal to the FE

      emitter.emit('game started', game._id);
      res.status(201).send(game);
    })
    .catch(error => {
      log.error(error);
      res.sendStatus(500);
    });
});

router.delete('/:gameId', (req, res) => {
  const { gameId } = req.params;

  Game.findById(gameId).populate('users host').exec()
    .then(game => Promise.all([
      game,
      ...game.users.map(u => u.setGameConnection(null)),
    ]))
    .then(([game]) => game.remove())
    .then(game => res.status(200).send(game))
    .catch(err => {
      log.error(err);

      res.sendStatus(500);
    });
});

module.exports = router;