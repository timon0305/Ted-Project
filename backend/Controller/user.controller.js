const {
    sFindUserEmail,
    sCreateUser,
    sGetUserByEmail,
    sGetAllUser,
} = require('../Service/user.service');

const {genSaltSync, hashSync, compareSync} = require('bcryptjs');
const {sign} = require('jsonwebtoken');
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');
const datetime = require('node-datetime');

module.exports = {
    createUser: (req, res) => {
        const body = req.body;
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
                body.photo = 'kk.png';
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
            if (results.active === '1') {
                const passwordCompare = compareSync(body.password, results.password);
                if (passwordCompare) {
                    results.userPassword = undefined;
                    const jsontoken = sign({result: results}, 'effie2020', {
                        expiresIn: '1h'
                    });
                    return res.status(200).json({
                        success: true,
                        data: results,
                        msg: 'Login Successfully',
                        token: jsontoken,
                    })
                }
                else {
                    return res.json({
                        success: false,
                        data: results,
                        msg: 'Invalid Password'
                    })
                }
            } else {
                return res.status(200).json({
                    success: false,
                    data: results,
                    msg: `You should verify`
                })
            }
        })
    },

    getAllUser: (req, res) => {
        sGetAllUser(req.body, (errors, results) => {
            console.log(results)
            return res.status(200).json({
                success: true,
                data: results,
                msg: 'Get All Users'
            })
        })
    }
};
