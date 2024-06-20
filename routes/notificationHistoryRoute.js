// For test

const express = require('express');
const router = express.Router();

const notificationHistoryController = require('../controllers/notificationHistoryController');

router.post('/api/v1/createNotificationHistory', notificationHistoryController.createNotificationHistory);

router.get('/api/1/getNotificationsByUserId/:user_id', notificationHistoryController.getNotificationsByUserId);

module.exports = router;