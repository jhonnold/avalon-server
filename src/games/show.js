const store = require('../store');
const _ = require('lodash');

module.exports = (req, res) => {
  const { gameId } = req.params;
  const { games, users } = store.getState();
  if (!(gameId in games)) return res.sendStatus(404);

  const game = games[gameId];
  const { id } = req.user;

  const role = game.roles[id];
  if (!role) return res.status(400).send('You are no in this game!');

  if (role === 'Vanilla Good') {
    return res.send({
      role,
      team: 'good',
      message: 'You are Vanilla Good. Try not to look too lost.',
    });
  } else if (role === 'Assassin') {
    const mordredId = _.findKey(game.roles, o => o === 'Mordred');
    const morganaId = _.findKey(game.roles, o => o === 'Morgana');

    const mordred = users[mordredId].name;
    const morgana = users[morganaId].name;

    return res.send({
      role,
      team: 'evil',
      message: `You are the Assassin, keep your eye out for Merlin! ${mordred} is Mordred, ${morgana} is your other ally.`
    });
  } else if (role === 'Morgana') {
    const mordredId = _.findKey(game.roles, o => o === 'Mordred');
    const assassinId = _.findKey(game.roles, o => o === 'Assassin');

    const mordred = users[mordredId].name;
    const assassin = users[assassinId].name;

    return res.send({
      role,
      team: 'evil',
      message: `You are Morgana, you look like Merlin! ${mordred} is Mordred, ${assassin} is your other ally.`,
    });
  } else if (role === 'Mordred') {
    const morganaId = _.findKey(game.roles, o => o === 'Morgana');
    const assassinId = _.findKey(game.roles, o => o === 'Assassin');

    const morgana = users[morganaId].name;
    const assassin = users[assassinId].name; 

    return res.send({
      role,
      team: 'evil',
      message: `You are Mordred, the ultimate evil!!! ${assassin} and ${morgana} are your allies.`,
    });
  } else if (role === 'Percival') {
    const morganaId = _.findKey(game.roles, o => o === 'Morgana');
    const merlinId = _.findKey(game.roles, o => o === 'Merlin');

    const morgana = users[morganaId].name;
    const merlin = users[merlinId].name; 

    const mixed = _.shuffle([morgana, merlin]);

    return res.send({
      role,
      team: 'good',
      message: `You are Percival, figure out who is who between ${mixed[0]} and ${mixed[1]}`,
    });
  } else if (role === 'Merlin') {
    const morganaId = _.findKey(game.roles, o => o === 'Morgana');
    const assassinId = _.findKey(game.roles, o => o === 'Assassin');

    const morgana = users[morganaId].name;
    const assassin = users[assassinId].name;

    const mixed = _.shuffle([morgana, assassin]);

    return res.send({
      role,
      team: 'good',
      message: `You are Merlin, the ultimate good!! Stay hidden from the assassin and lead your team through the unknown! Keep your eyes on ${mixed[0]} and ${mixed[1]}.`,
    });
  } else {
    return res.sendStatus(400);
  }
};