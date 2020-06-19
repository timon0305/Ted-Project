const {
    sFindUserName,
    sFindUserEmail,
    sCreateUser,
    sGetUserByEmail,
    sGetAllUser,
    sEditUser,
    sDeleteUser,
} = require('../Service/user.service');

const {genSaltSync, hashSync, compareSync} = require('bcryptjs');
const {sign} = require('jsonwebtoken');
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');
const datetime = require('node-datetime');

module.exports = {
    createUser: (req, res) => {
        const body = req.body;
        sFindUserName(body.userName, (err, results) => {
           if (results) {
               return res.json({
                   success: false,
                   msg: 'UserName is already existed'
               })
           }
           else {
               sFindUserEmail(body.userEmail, (err, results) => {
                   if (results) {
                       return res.json({
                           success: false,
                           msg: 'UserEmail is already existed'
                       })
                   }
                   else {
                       const salt = genSaltSync(10);
                       body.password = hashSync(body.password, salt);
                       body.active = '0';

                       sCreateUser(body, (err, results) => {
                           if (err) {
                               return res.status(500).json({
                                   success: false,
                                   msg: 'Database Connection Error'
                               })
                           }
                           return res.status(200).json({
                               success: true,
                               data: results,
                               msg: 'Successfully Registered.'
                           })
                       })
                   }
               });
           }
        });

    },

    userLogin: (req, res) => {
        const body = req.body;
        sGetUserByEmail(body.userEmail, (err, results) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    msg: 'Server Error'
                })
            }
            if (!results) {
                return res.status(200).json({
                    success: false,
                    data: null,
                    msg: `User doesn't exist`
                })
            }
            if (results['active'] === '1') {
                const passwordCompare = compareSync(body.password, results.password);
                if (passwordCompare) {
                    results.userPassword = undefined;
                    const jsonToken = sign({result: results}, 'effie2020', {
                        expiresIn: '1h'
                    });
                    return res.status(200).json({
                        success: true,
                        data: results,
                        msg: 'Login Successfully',
                        token: jsonToken,
                    })
                }
                else {
                    return res.json({
                        success: false,
                        data: results,
                        msg: 'Invalid Password'
                    })
                }
            }  else {
                return res.json({
                    success: false,
                    data: results,
                    msg: 'This is not allowed'
                })
            }

        })
    },

    getUser: (req, res) => {
        const body = req.body;
        sGetAllUser(body, (err, results) => {
            return res.json({
                success: true,
                data: results,
                msg: 'All Users'
            })
        })
    },

    editUser: (req, res) => {
        const body = req.body;
        sEditUser(body, (err, results) => {
            return res.json({
                success: true,
                data: results,
                msg: 'success'
            })
        })
    },

    deleteUser: (req, res) => {
        const id = req.body.id;
        sDeleteUser(id, (err, results) => {
            return res.json({
                success: true,
                msg: 'successfully deleted'
            })
        })
    }
};
