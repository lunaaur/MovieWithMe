require('@babel/register')
require('dotenv').config();
const express = require('express');
const cors = require('cors')
const app = express();
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
//импорт вспомогательных ф-й
const dbCheck = require('./db/dbCheck');

// импорт роутов

 // вызов функции проверки соединения с базоый данных
dbCheck();

app.use(express.static(path.resolve('public')));
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const getApi = require('./routers/ApiRouter')

const corsOptions = {
  credentials: true, 
  origin: 'http://localhost:3000'
}
app.use(cors(corsOptions));

const { SESSION_SECRET } = process.env;
const sessionConfig = {
  name: 'OwlCookie', // * Название куки
  store: new FileStore(), // * подключение стора (БД для куки) для хранения
  secret: SESSION_SECRET ?? 'mySecretPass', // * ключ для шифрования куки
  resave: false, // * если true, пересохраняет сессию, даже если она не поменялась
  saveUninitialized: false, // * Если false, куки появляются только при установке req.session
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 10, // * время жизни в ms (10 дней)
    httpOnly: true, // * куки только по http
  },
};

app.use(session(sessionConfig));

//роутеры
app.use('/getapi', getApi)

const PORT = process.env.PORT || 3100;
app.listen(PORT, (err) => {
  if (err) return console.log('Ошибка запуска сервера.', err.message)
  console.log(`Сервер запущен на http://localhost:${PORT} `);
});
