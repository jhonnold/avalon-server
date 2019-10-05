const _ = require('lodash');
const { model, Schema } = require('mongoose');
const missionCount = require('../util/missionCount');

const missionSchema = new Schema({
    failsRequired: { type: Number, default: 1 },
    usersRequired: Number,
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    userActions: { type: Map, of: Boolean },
});

missionSchema.virtual('numberOfFails').get(function() {
    const actions = this.userActions.values();
    if (actions.length < this.usersRequired) return 0;

    return _.countBy(actions)['false'];
});

missionSchema.virtual('result').get(function() {
    const actions = this.userActions.values();
    if (actions.length < this.usersRequired) return null;

    return _.countBy(actions)['false'] >= this.failsRequired; 
});

missionSchema.statics.createForCount = async function (size) {
    const missions = missionCount(size).map((m, i) => new Mission({
        failsRequired: i === 3 && size > 6 ? 2 : 1,
        usersRequired: m,
        users: _.times(m, _.constant(null)),
      }));
    
      await Promise.all(missions.map(m => m.save()));

      return missions.map(m => m._id);
}

missionSchema.set('toJSON', { virtuals: true });
const Mission = model('Mission', missionSchema);

module.exports = Mission;