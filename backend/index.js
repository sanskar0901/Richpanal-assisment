const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const bodyParser = require('body-parser');


const app = express();
app.use(cors());

app.use(bodyParser.json());
const port = process.env.PORT || 5000;

const uri = process.env.URI;

mongoose.connect(uri, {});

mongoose.connection.once('open', () => {
    console.log("mongodb connected");
})
// const ferry = require('./Routes/Ferry')
// const bookings = require('./Routes/Booking')
const user = require('./routes/User')
const plan = require('./routes/Plan')
const subscription = require('./routes/Subscribe')

app.use('/user', user)
app.use('/plan', plan)
app.use('/subscription', subscription)

// app.use('/ferry', ferry)
// app.use('/booking', bookings)

app.get('/', (req, res) => {
    res.json("running!")
})

app.listen(port, () => {
    console.log("server running on port :-" + port);
});