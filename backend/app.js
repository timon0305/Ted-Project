require('dotenv').config();
const express = require('express');
const cors = require('cors');
const expressJwt = require('express-jwt');
const multer = require('multer');
const app = express();
const userRouter = require('./Router/user.router');
app.use(express.json());
app.use(cors());

app.use('/api/users', userRouter);

app.listen(process.env.APP_PORT, () => {
    console.log('Server up and running', process.env.APP_PORT);
});