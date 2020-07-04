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


const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'upload')
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname)
    }
});

let profile = multer({storage: storage});

app.post('/api/users/profile', profile.single('file'), (req, res, next) => {
    const file = req.file;
    if (!file) {
        const error = new Error('Please upload a file');
        return next(error)
    }
    res.send({status: 'Ok'})
});

app.listen(process.env.APP_PORT, () => {
    console.log('Server up and running', process.env.APP_PORT);
});