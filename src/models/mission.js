const _ = require('lodash');
const { model, Schema } = require('mongoose');

const missionSchema = new Schema({
    failsRequired: { type: Number, default: 1 },
    usersRequired: Number,
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    userVotes: { type: Map, of: Boolean },
});

missionSchema.virtual('numberOfFails').get(function() {
    const votes = this.userVotes.values();
    if (votes.length < this.usersRequired) return 0;

    return _.countBy(votes)['false'];
});

missionSchema.virtual('result').get(function() {
    const votes = this.userVotes.values();
    if (votes.length < this.usersRequired) return null;

    return _.countBy(votes)['false'] >= this.failsRequired; 
});

missionSchema.set('toJSON', { virtuals: true });
const Mission = model('Mission', missionSchema);

module.exports = Mission;