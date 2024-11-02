const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:'); // Here I am using SQLite for simplicity

class Event extends Model {}
Event.init({
  eventId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  availableTickets: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, { sequelize, modelName: 'event' });

class Booking extends Model {}
Booking.init({
  eventId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, { sequelize, modelName: 'booking' });

class WaitingList extends Model {}
WaitingList.init({
  eventId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, { sequelize, modelName: 'waitingList' });

module.exports = { Event, Booking, WaitingList, sequelize };
