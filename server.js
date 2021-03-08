    const path = require('path');
    const express = require('express');
    const mongoose = require('mongoose');
    const cookieParser = require('cookie-parser');
    const authRoutes = require('./routes/authRoutes');
    const { requireAuth, checkUser } = require('./middleware/authMiddleware');

    const app = express();

    //middleware
    app.use(cookieParser());
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    //view engine
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, 'views'));

    //activating server
    const dbLink = 'mongodb+srv://admin:admin1234@cluster0.owbfr.mongodb.net/nodejs-jwt-auth?retryWrites=true&w=majority';
    mongoose.connect(dbLink, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})

    const db = mongoose.connection;

    db.on('open', () => {
        console.log('Database Connected.');
    });

    db.on('error', (error) => {
        console.log(error);
    });

    app.listen(3000, () => {
        console.log('Server have been connected at port 3000.');
    })

    //routes

    app.get('*', checkUser);

    app.get('/', (req, res) => {
        res.render('index');
    });

    app.get('/home', requireAuth, (req, res) => {
        res.render('home');
    })

    app.use(authRoutes);