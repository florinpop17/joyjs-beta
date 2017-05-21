const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const PORT = process.env.port || 3000;
const userRouter = require('./routes/userRouter');
const questionRouter = require('./routes/questionRouter');

// connect to database
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/joyjs");

// middleware
app.use(express.static(path.join(__dirname, '../client/build/')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
    next();
})

// routers
app.use('/api/users', userRouter);
app.use('/api/questions', questionRouter);

// default route
app.get("/", (req, res) => {
    // send static files
    res.send(path.join(__dirname, '../client/build/', 'index.html'));
});

app.listen(PORT, () => { console.log("Application running on port "+PORT ); });
