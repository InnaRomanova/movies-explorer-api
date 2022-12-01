require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const routers = require('./routes/index');
const errorsHandler = require('./middlewares/errorsHandler');
const cors = require('./middlewares/cors');
const limiter = require('./middlewares/limiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000, NODE_ENV, ADDRESS_DB } = process.env; // Слушаем 3000 порт

const app = express();
mongoose.connect(NODE_ENV === 'production' ? ADDRESS_DB : 'mongodb://127.0.0.1/moviesdb');
app.use(limiter);
app.use(bodyParser.json());
app.use(cookieParser());
app.use(requestLogger); // подключаем логгер запросов
app.use(helmet());
app.use(cors);
app.use(routers);
app.use(errorLogger); // подключаем логгер ошибок
app.use(errors());
app.use(errorsHandler);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening in ${NODE_ENV || 'develop'} mode at port ${PORT}`);
});
