const _ = require('lodash');
const { model, Schema } = require('mongoose');
const missionCount = require('../util/missionCount');

const missionSchema = new Schema({
    failsRequired: { type: Number, default: 1 },
    usersRequired: Number,
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    userActions: { type: Map, of: Boolean, default: {} },
});

missionSchema.virtual('numberOfFails').get(function() {
    if (this.userActions.size < this.usersRequired) return 0;

    return _.countBy([...this.userActions.values()])['false'] || 0;
});

missionSchema.virtual('result').get(function() {
    if (this.userActions.size < this.usersRequired) return null;

    return _.get(_.countBy([...this.userActions.values()]), 'false', 0) < this.failsRequired; 
});

missionSchema.statics.createForCount = async function (size) {
    const missions = missionCount(size).map((m, i) => new Mission({
        failsRequired: i === 3 && size > 6 ? 2 : 1,
        usersRequired: m,
        users: _.times(m, _.constant(null)),
        userActions: {},
      }));
    
      await Promise.all(missions.map(m => m.save()));

      return missions.map(m => m._id);
}

missionSchema.set('toJSON', { virtuals: true });
const Mission = model('Mission', missionSchema);

module.exports = Mission;