import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const chai = require('chai');
const chaiHttp = require('chai-http');
import { expect } from 'chai';
import { sequelize, Event, Booking, WaitingList } from '../src/models/event.js';
import server from '../src/index.js';

chai.use(chaiHttp);

describe('Event Ticket Booking System', () => {
  let serverInstance;

  before(async () => {
    process.env.NODE_ENV = 'test';
    process.env.PORT = 4000; // Using a different port for tests
    
    await sequelize.sync({ force: true }); // Ensuring database synchronization
    serverInstance = server.listen(4000);

    // Initialize event and book all tickets to simulate sold-out scenario
    await Event.create({ eventId: 1, availableTickets: 1 });
    await Booking.create({ eventId: 1, userId: 1 });
  });

  after((done) => {
    serverInstance.close(done);
  });

  it('should initialize an event with a set number of tickets', (done) => {
    chai.request(server)
      .post('/initialize')
      .send({ eventId: 2, tickets: 100 })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message').eql('Event initialized');
        done();
      });
  });

  it('should book a ticket for a user', (done) => {
    chai.request(server)
      .post('/book')
      .send({ eventId: 2, userId: 123 })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message').eql('Ticket booked successfully');
        done();
      });
  });

  it('should add a user to the waiting list if tickets are sold out', async () => {
    // Ensure tickets are sold out
    await Event.update({ availableTickets: 0 }, { where: { eventId: 1 } });
    const res = await chai.request(server)
      .post('/book')
      .send({ eventId: 1, userId: 2 });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property('message').eql('No tickets available. Added to waiting list');
  });

  it('should cancel a booking and assign the ticket to the next user in line', (done) => {
    chai.request(server)
      .post('/cancel')
      .send({ eventId: 1, userId: 1 })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message').eql('Booking cancelled successfully');
        done();
      });
  });

  it('should retrieve the current status of an event', (done) => {
    chai.request(server)
      .get('/status/1')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('availableTickets');
        expect(res.body).to.have.property('waitingListCount');
        done();
      });
  });
});
