const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/user');

const router = express.Router();

router.get('/me', auth, (req, res) => {
  return res.status(200).send(req.user);
});

router.post('/', (req, res) => {
  const { username, password, displayName } = req.body;
  if (!username || !password || !displayName) {
    return res.status(400).send('username, pass, and displayName are required!');
  }
  
  const user = new User({ username, password, displayName });
  user.save()
    .then(user => {
      res.status(201).send({ user, token: user.generateToken() });
    })
    .catch(error => {
      res.status(400).send(error);
    })
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  User.login(username, password)
    .then(user => {
      if (!user) return res.status(401).status({ error: 'Login Failed!' });

      res.status(200).send({ user, token: user.generateToken() });
    })
    .catch(error => {
      res.status(400).send(error);
    })
});

module.exports = router;