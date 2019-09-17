const express = require('express');
const Game = require('../models/game');

const router = express.Router();

router.get('/', (_, res) => {
  Game.find().exec()
    .then(games => {
      res.status(200).send(games);
    });
})

router.get('/:gameId', (req, res) => {
  const { gameId } = req.params;

  Game.findById(gameId).exec()
    .then(game => {
      if (!game) throw new Error({ error: 'Not Found!' });

      res.status(200).send(game);
    })
    .catch(error => {
      res.status(500).send(error);
    });
});

router.post('/', (req, res) => {
  const { roomId } = req.body;
  if (!roomId) return res.status(400).send('roomId is required!');

  Game.fromRoomId(roomId)
    .then(game => {
      res.status(201).send(game);
    });
});

module.exports = router;