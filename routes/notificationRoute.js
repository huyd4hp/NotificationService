// For test

const express = require('express');
const router = express.Router();

const notificationController = require('../controllers/notificationController')

router.post('/api/v1/addUserAndSendMail', notificationController.addUserAndSendMail);

router.post('/api/v1/sendNotificationEvent', notificationController.sendNotificationEvent);

router.post('/api/v1/sendNotification', notificationController.sendNotification);

router.get('/api/v1/getUsersByOwnerId/:owner_id', notificationController.getUsersByOwnerId);

module.exports = router;