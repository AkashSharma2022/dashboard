const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const conn = require('../dbConnection').promise();

exports.register = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    try {

        const [row] = await conn.execute(
            "SELECT `email`, `phone` FROM `users` WHERE `email`= ? OR `phone` = ?",
            [req.body.email, req.body.phone]
        );

        if (row.length > 0) {
            return res.status(201).json({
                message: "The E-mail or phone already in use",
            });
        }

        const hashPass = await bcrypt.hash(req.body.password, 12);

        const [rows] = await conn.execute('INSERT INTO `users`(`name`,`email`,`password`,`phone`) VALUES(?,?,?,?)', [
            req.body.name,
            req.body.email,
            hashPass,
            req.body.phone
        ]);

        if (rows.affectedRows === 1) {
            return res.status(201).json({
                message: "The user has been successfully inserted.",
            });
        }

    } catch (err) {
        next(err);
    }
}