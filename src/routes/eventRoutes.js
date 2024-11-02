const express = require('express');
const { initializeEvent, bookTicket, cancelBooking, getStatus } = require('../controllers/eventController');
const router = express.Router();

router.post('/initialize', initializeEvent);
router.post('/book', bookTicket);
router.post('/cancel', cancelBooking);
router.get('/status/:eventId', getStatus);

module.exports = router;