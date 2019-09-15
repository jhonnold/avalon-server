const store = require('../store');
const _ = require('lodash');

module.exports = (req, res) => {
  const { gameId } = req.params;
  const { games, users } = store.getState();
  if (!(gameId in games)) return res.sendStatus(404);

  const game = games[gameId];
  const { id } = req.user;

  const role = game.roles[id];
  if (!role) return res.status(400).send('You are not in this game!');

  const mordredId = _.findKey(game.roles, o => o === 'Mordred');
  const mordred = _.get(users, [mordredId, 'name'], 'Nobody');

  const morganaId = _.findKey(game.roles, o => o === 'Morgana');
  const morgana = _.get(users, [morganaId, 'name'], 'Nobody');
  
  const assassinId = _.findKey(game.roles, o => o === 'Assassin');
  const assassin = _.get(users, [assassinId, 'name'], 'Nobody');
  
  const merlinId = _.findKey(game.roles, o => o === 'Merlin');
  const merlin = _.get(users, [merlinId, 'name'], 'Nobody');

  switch (role) {
    case 'Vanilla Good': {
      return res.send({
        role,
        team: 'Good',
        message: 'You are Vanilla Good. Try find the good!',
      });
    }
    
    case 'Assassin': {
      return res.send({
        role,
        team: 'Evil',
        message: `You are the Assassin, keep your eye out for Merlin! ${mordred} is Mordred, ${morgana} is your other ally.`
      });
    }
    
    case 'Morgana': {
      return res.send({
        role,
        team: 'Evil',
        message: `You are Morgana, you look like Merlin! ${mordred} is Mordred, ${assassin} is your other ally.`,
      });
    }

    case 'Mordred': {
      return res.send({
        role,
        team: 'Evil',
        message: `You are Mordred, the ultimate evil!!! ${assassin} and ${morgana} are your allies.`,
      });
    }

    case 'Percival': {
      const mixed = _.shuffle([morgana, merlin]);

      return res.send({
        role,
        team: 'Good',
        message: `You are Percival, figure out who is who between ${mixed[0]} and ${mixed[1]}`,
      });
    }

    case 'Merlin': {
      const mixed = _.shuffle([morgana, assassin]);

      return res.send({
        role,
        team: 'Good',
        message: `You are Merlin, the ultimate good!! Stay hidden from the assassin and lead your team through the unknown! Keep your eyes on ${mixed[0]} and ${mixed[1]}.`,
      });
    }

    default: {
      return res.status(400).send('You are an unknown in this game!');
    }
  }  
};