const pool = require('../Config/database');

module.exports = {
    sFindUserName: (userName, callback) => {
        pool.query(
            `select * from users where userName = ?`,
            [userName],
            (err, results) => {
                if (err) {
                    callback(err);
                }
                return callback(null, results[0]);
            }
        )
    },

    sFindUserEmail: (userEmail, callback) => {
        pool.query(
            `select * from users where userEmail = ?`,
            [userEmail],
            (err, results) => {
                if (err) {
                    callback(err);
                }
                return callback(null, results[0]);
            }
        )
    },

    sCreateUser: (data, callback) => {
        pool.query(
            `insert into users(userName, firstName, lastName, userEmail, password, role, phoneNumber, active) 
            values(?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.userName,
                data.firstName,
                data.lastName,
                data.userEmail,
                data.password,
                data.role,
                data.phoneNumber,
                data.active,
            ],
            (error, result) => {
                if (error) {
                    return callback(error)
                }
                return callback(null, result)
            }
        )
    },

    sGetUserByEmail: (userEmail, callback) => {
        pool.query(
            `select * from users where userEmail = ?`,
            [userEmail],
            (err, result) => {
                if (err) {
                    callback(err)
                }
                return callback(null, result[0])
            }
        )
    },

    sGetAllUser: (role, callback) => {
        pool.query(
            `select * from users`,
            (err, result) => {
                if (err) {
                    callback(err)
                }
                return callback(null, result)
            }
        )
    },

    sEditUser: (data, callback) => {
        const id = data.id;
        const active = data.active;
        if (active === '1') {
            pool.query(
                `update users set active = 0 where id = ?`,
                [id],
                (error, result) => {
                    if (error) {
                        return callback(error)
                    }
                    return callback(null, result)
                }
            )
        } else {
            pool.query(
                `update users set active = 1 where id = ?`,
                [id],
                (error, result) => {
                    if (error) {
                        return callback(error)
                    }
                    return callback(null, result)
                }
            )
        }

    },

    sDeleteUser: (id, callback) => {
        pool.query(
            `delete from users where id = ?`,
            [id],
            (error, results) => {
                if (error) {
                    return callback(error)
                }
                return callback(null, results)
            }
        )
    }

};