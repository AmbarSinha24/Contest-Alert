const { ContestType, User } = require('../schemas');

const getContestTypes = async (req, res) => {
    try {
        const types = await ContestType.find();
        res.json(types);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch contest types' });
    }
};

const savePreferences = async (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
    const { contestTypeIds } = req.body;
    try {
        await User.findByIdAndUpdate(req.user.id, { reminderPreferences: contestTypeIds });
        res.json({ message: 'Preferences updated' });
    } catch (err) {
        res.status(500).json({ error: 'Update failed' });
    }
};

const getPreferences = async (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
    try {
        const populatedUser = await User.findById(req.user.id).populate('reminderPreferences');
        res.json(populatedUser.reminderPreferences || []);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch preferences' });
    }
};

const getUserInfo = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    try {
        const populatedUser = await User.findById(req.user.id).populate('reminderPreferences');
        const prefs = (populatedUser.reminderPreferences || []).map(p => ({
            id: p.id,
            name: p.name
        }));

        res.json({
            name: req.user.name,
            email: req.user.email,
            preferences: prefs
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch user info' });
    }
};

module.exports = {
    getContestTypes,
    savePreferences,
    getPreferences,
    getUserInfo
};
