## Event Ticket Booking System

## Description
A Node.js application for an event ticket booking system, designed to demonstrate backend development skills including asynchronous programming, concurrency handling, API design, and Test-Driven Development (TDD).

## Features
- Initialize an event with a set number of available tickets.
- Allow users to book tickets concurrently.
- Implement a waiting list for when tickets are sold out.
- Provide endpoints to view available tickets and the waiting list.
- Handle ticket cancellations and automatic assignment to waiting list users.
- Save the order details to a RDBMS.

## Setup and Running Instructions

1. **Clone the Repository**:
   ```sh
   git clone <repository-url>
   cd event-ticket-booking

2. **Install Dependencies**
    npm install

3. **Run the Application**
    npm start

4. **Run the Tests**
    npm test

## API Endpoints
POST /initialize: Initialize a new event with a given number of tickets.

POST /book: Book a ticket for a user. If sold out, add the user to the waiting list.

POST /cancel: Cancel a booking for a user. If there’s a waiting list, automatically assign the ticket to the next user in line.

GET /status/:eventId: Retrieve the current status of an event (available tickets, waiting list count).

## Design Choices
Used Express.js for the server.

Employed Sequelize for ORM with SQLite for simplicity.

Followed TDD with Mocha and Chai.

Implemented middleware for parsing JSON requests.

Ensured concurrency handling and thread-safety.

## Author
Wisdom Lotanna

## License
This project is licensed under the MIT License.
