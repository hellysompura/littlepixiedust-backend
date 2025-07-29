const User = require("../models/User")
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// user sign up
exports.signup = async (req, res) => {
    try {
        const { name, address, mobile, state, country, email, password } = req.body

        if (!name || !address || !mobile || !state || !country || !email || !password) {
            return res.status(400).json({ message: 'All Fields required' })
        }

        const doesUserExists = await User.findOne({ email })

        if (doesUserExists) return res.status(400).json({ message: 'User already exists' })

        const user = await User.create({ name, address, mobile, state, country, email, password })

        const token = generateToken(user._id);

        res.status(201).json({
            user: {
                id: user._id,
                name,
                email,
                mobile,
                address,
                state,
                country
            },
            token
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// user log in
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) return res.status(400).json({ message: 'Email and Password both are required' })

        const isUserThere = await User.findOne({ email })

        if (!isUserThere || isUserThere.password !== password) return res.status(400).json({ error: 'Invalid credentials' });

        const token = generateToken(isUserThere._id);
        res.json({
            user: {
                id: isUserThere._id,
                name: isUserThere.name,
                email: isUserThere.email
            },
            token
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}