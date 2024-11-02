const { sequelize, Event, Booking, WaitingList } = require('../models/event');

// Initialize a new event with a given number of tickets
const initializeEvent = async (req, res) => {
  const { eventId, tickets } = req.body;
  console.log(`Initializing event ${eventId} with ${tickets} tickets`);
  try {
    await Event.create({ eventId, availableTickets: tickets });
    res.status(200).json({ message: 'Event initialized' });
  } catch (error) {
    console.error('Error initializing event:', error);
    res.status(500).json({ error: 'Failed to initialize event' });
  }
};

// Book a ticket for a user
const bookTicket = async (req, res) => {
  const { eventId, userId } = req.body;
  console.log(`Booking ticket for user ${userId} for event ${eventId}`);
  const transaction = await sequelize.transaction();
  try {
    const event = await Event.findOne({ where: { eventId }, lock: true, transaction });
    if (!event) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Event not found' });
    }

    if (event.availableTickets > 0) {
      await Booking.create({ eventId, userId }, { transaction });
      event.availableTickets -= 1;
      await event.save({ transaction });
      await transaction.commit();
      res.status(200).json({ message: 'Ticket booked successfully' });
    } else {
      await WaitingList.create({ eventId, userId }, { transaction });
      await transaction.commit();
      res.status(200).json({ message: 'No tickets available. Added to waiting list' });
    }
  } catch (error) {
    await transaction.rollback();
    console.error('Error booking ticket:', error);
    res.status(500).json({ error: 'Failed to book ticket' });
  }
};

// Cancel a booking for a user
const cancelBooking = async (req, res) => {
  const { eventId, userId } = req.body;
  console.log(`Cancelling booking for user ${userId} for event ${eventId}`);
  const transaction = await sequelize.transaction();
  try {
    const booking = await Booking.findOne({ where: { eventId, userId }, lock: true, transaction });
    if (!booking) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Booking not found' });
    }

    await booking.destroy({ transaction });
    const nextInLine = await WaitingList.findOne({ where: { eventId }, lock: true, transaction });
    if (nextInLine) {
      await Booking.create({ eventId, userId: nextInLine.userId }, { transaction });
      await nextInLine.destroy({ transaction });
    } else {
      const event = await Event.findOne({ where: { eventId }, lock: true, transaction });
      event.availableTickets += 1;
      await event.save({ transaction });
    }

    await transaction.commit();
    res.status(200).json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error cancelling booking:', error);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
};

// Retrieve the current status of an event
const getStatus = async (req, res) => {
  const { eventId } = req.params;
  console.log(`Getting status for event ${eventId}`);
  try {
    const event = await Event.findOne({ where: { eventId } });
    const waitingListCount = await WaitingList.count({ where: { eventId } });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.status(200).json({ availableTickets: event.availableTickets, waitingListCount });
  } catch (error) {
    console.error('Error getting status:', error);
    res.status(500).json({ error: 'Failed to retrieve event status' });
  }
};

module.exports = { initializeEvent, bookTicket, cancelBooking, getStatus };