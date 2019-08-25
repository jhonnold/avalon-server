const _ = require('lodash');

const baseRoles = ['Merlin', 'Percival', 'Vanilla Good', 'Assassin', 'Morgana'];
const rolesMap = {
  5: baseRoles,
  6: [...baseRoles, 'Vanilla Good'],
  7: [...baseRoles, 'Vanilla Good', 'Mordred'],
  8: [...baseRoles, 'Vanilla Good', 'Mordred', 'Vanilla Good'],
  9: [...baseRoles, 'Vanilla Good', 'Mordred', 'Vanilla Good', 'Vanilla Good'],
  10: [
    ...baseRoles,
    'Vanilla Good',
    'Mordred',
    'Vanilla Good',
    'Vanilla Good',
    'Oberon',
  ],
};

module.exports = players => {
  const roles = _.shuffle(rolesMap[players.length]);
  return _.zipObject(players, roles);
};
