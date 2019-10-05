const log = require('fancy-log');
const express = require('express');
const _ = require('lodash');
const Mission = require('../models/mission');

const router = express.Router();

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const mission = await Mission.findById(id).populate('users').exec();
        if (!mission) return res.status(404).send({ error: 'Mission not found!' });

        return res.status(200).send(mission);
    } catch (error) {
        log.error(error);

        res.sendStatus(500);
    }
});

router.post('/:id/action', async (req, res) => {
    const { id } = req.params;
    const { action } = req.body;

    if (!action) return res.status(400).send({ error: 'action is required!' });
    try {
        const mission = await Mission.findById(id).populate('users').exec();
        if (!mission) return res.status(404).send({ error: 'Mission not found!' });
        
        const usersOnMission = mission.users.map(u => u._id);
        if (!_.includes(usersOnMission, req.user._id))
            return res.status(403).send({ error: 'Not on this mission!' });

        mission.userActions.set(req.user._id, !!action);
        await mission.save();

        req.io.emit('mission updated', mission);
        res.status(200).send(mission);
    } catch (error) {
        log.error(error);

        res.sendStatus(500);
    }
});

module.exports = router;