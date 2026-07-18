const express = require('express');
const { getContestTypes, savePreferences, getPreferences, getUserInfo } = require('../controllers/userController');

const router = express.Router();

router.get('/api/contest-types', getContestTypes);
router.get('/api/user/preferences', getPreferences);
router.post('/api/user/preferences', savePreferences);
router.get('/api/user/info', getUserInfo);

module.exports = router;
