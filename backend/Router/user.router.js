const {
    createUser,
    userLogin,
    getAllUser,
} = require('../Controller/user.controller');

const auth = require('../Controller/middleware');
const router = require('express').Router();

router.post('/userRegister', createUser);

router.post('/userLogin', userLogin);

router.get('/getAllUser', getAllUser);

module.exports = router;