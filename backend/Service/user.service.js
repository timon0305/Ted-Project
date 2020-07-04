const pool = require('../Config/database');

module.exports = {
    sFindUserEmail: (userEmail, callback) => {
        pool.query(
            `select * from users where email = ?`,
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
            `insert into users(fullname, username, email, password, role, photo, telephone, active) values(?, ?, ?, ?,?,?, ?, ?)`,
            [
                data.fullName,
                data.userName,
                data.userEmail,
                data.password,
                data.role,
                data.photo,
                data.telephone,
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
            `select * from users where email = ?`,
            [userEmail],
            (err, result) => {
                if (err) {
                    callback(err)
                }
                return callback(null, result[0])
            }
        )
    },

    sGetAllUser: (data, callback) => {
        pool.query(
            `select * from users`,
            (err, result) => {
                if (err) {
                    callback(err)
                }
                return callback(null, result)
            }
        )
    }
};