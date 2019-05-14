const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const { LOGGER } = require('./config/index');
const EmailRoutes = require('./routes/email');

const app = express();

app.use(helmet());

app.use(morgan(LOGGER));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/email', EmailRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`App started on port ${port}`));
