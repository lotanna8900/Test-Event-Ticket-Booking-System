const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./models/event');
const eventRoutes = require('./routes/eventRoutes');

const app = express();
app.use(bodyParser.json());
app.use('/', eventRoutes);

const syncOptions = { force: process.env.NODE_ENV === 'test' };

sequelize.sync(syncOptions).then(() => {
  const PORT = process.env.PORT || 3000;
  if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  }
}).catch((error) => {
  console.error('Unable to synchronize the database:', error);
});

module.exports = app;