const _ = require('lodash');

const baseRoles = ['Merlin', 'Percival', 'Vanilla Good', 'Assassin', 'Morgana'];
const rolesMap = {
  5: baseRoles,
  6: [...baseRoles, 'Vanilla Good'],
  7: [...baseRoles, 'Vanilla Good', 'Mordred'],
  8: [...baseRoles, 'Vanilla Good', 'Mordred', 'Vanilla Good'],
  9: [...baseRoles, 'Vanilla Good', 'Mordred', 'Vanilla Good', 'Vanilla Good'],
};

module.exports = {
  roleGenerator: players => {
    if (!players || players.length < 5 || players.length > 9) throw new Error('literally cant even handle that');

    const roles = _.shuffle(rolesMap[players.length]);
    return _.zipObject(players, roles);
  },
  requiredInfo: (id, roleMap, users) => {
    const role = roleMap[id];

    const mordredId = _.findKey(roleMap, o => o === 'Mordred');
    const mordred = _.get(users, [mordredId, 'displayName'], 'Nobody');

    const morganaId = _.findKey(roleMap, o => o === 'Morgana');
    const morgana = _.get(users, [morganaId, 'displayName'], 'Nobody');

    const assassinId = _.findKey(roleMap, o => o === 'Assassin');
    const assassin = _.get(users, [assassinId, 'displayName'], 'Nobody');

    const merlinId = _.findKey(roleMap, o => o === 'Merlin');
    const merlin = _.get(users, [merlinId, 'displayName'], 'Nobody');

    switch (role) {
      case 'Vanilla Good': {
        return {
          role,
          team: 'Good',
          knowledge: {},
        };
      }

      case 'Assassin': {
        return {
          role,
          team: 'Evil',
          knowledge: {
            'Mordred': mordred,
            'Morgana': morgana,
          },
        };
      }

      case 'Morgana': {
        return {
          role,
          team: 'Evil',
          knowledge: {
            'Mordred': mordred,
            'Assassin': assassin,
          },
        };
      }

      case 'Mordred': {
        return {
          role,
          team: 'Evil',
          knowledge: {
            'Morgana': morgana,
            'Assassin': assassin,
          },
        };
      }

      case 'Percival': {
        const mixed = _.shuffle([morgana, merlin]);

        return {
          role,
          team: 'Good',
          knowledge: {
            'First Unknown': mixed[0],
            'Second Unknown': mixed[1],
          },
        }
      }

      case 'Merlin': {
        const mixed = _.shuffle([morgana, assassin]);

        return {
          role,
          team: 'Good',
          knowledge: {
            'First Evil': mixed[0],
            'Second Evil': mixed[1],
          },
        };
      }

      default: {
        return null;
      }
    }
  },
};

