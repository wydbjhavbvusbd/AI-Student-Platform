const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./model/User');

const router = express.Router();

// REGISTER
router.post('/register', async (req, res) => {

    try {

        const { username, email, password } = req.body;

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const user = new User({
            username,
            email,
            password: hashedPassword
        });

        await user.save();

        res.json({ message: 'User registered successfully' });

    } catch (error) {

        res.status(500).json({ error: error.message });
    }
});
// LOGIN
router.post('/login', async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: 'User not found'
            });
        }

        const isMatch =
            await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: 'Wrong password'
            });
        }

        const token = jwt.sign(
            { id: user._id },
            'SECRET_KEY',
            { expiresIn: '7d' }
        );

        res.json({ token, user });

    } catch (error) {
 res.status(500).json({ error: error.message });
    }
});

module.exports = router;