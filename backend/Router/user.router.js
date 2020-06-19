const {
    createUser,
    userLogin,
    getUser,
    editUser,
    deleteUser,
} = require('../Controller/user.controller');

const auth = require('../Controller/middleware');
const router = require('express').Router();

router.post('/userRegister', createUser);
router.post('/userLogin', userLogin);
router.post('/getAllUser', getUser);
router.post('/editUser', editUser);
router.post('/deleteUser', deleteUser);
module.exports = router;