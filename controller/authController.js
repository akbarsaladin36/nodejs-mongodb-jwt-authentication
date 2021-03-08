    const jwt = require('jsonwebtoken');
    const User = require('../models/user');

    const maxAge = 3 * 24 * 60 * 60;
    const createToken = (id) => {
        return jwt.sign({ id }, 'admin1234', { expiresIn: maxAge });
    } 
    
    module.exports.signup_get = (req, res) => {
        res.render('signup');
    }

    module.exports.signup_post = async (req, res) => {
        const { email, password } = req.body;

        try {
            const user = await User.create({ email, password });
            const token = await createToken(user._id);
            res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
            res.redirect('/home');
        } catch(err) {
            console.log(err);
            res.redirect('/');
        }
    }

    module.exports.login_get = (req, res) => {
        res.render('login')
    }

    module.exports.login_post = async (req, res) => {
        const { email, password } = req.body;

        try {
            const user = await User.login(email, password);
            const token = createToken(user._id);
            res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
            res.redirect('/home');
        } catch(err) {
            console.log(err);
            res.redirect('/');
        }
    }

    module.exports.logout_get = (req, res) => {
        res.cookie('jwt', '', { maxAge: 1 });
        res.redirect('/');
    }