const express = require('express');
const app = express();
const cors = require("cors");
const connectDb = require('./config/dbConnection');

const notificationController = require('./controllers/notificationController');

notificationController.runConsumer_booking();
notificationController.runConsumer_event();

// middlewares
app.use(express.json());
app.use(cors());

// Connect MongoDB
connectDb();

// Import các route
const notificationRoute = require('./routes/notificationRoute');
const notificationHistoryRoute = require('./routes/notificationHistoryRoute');

// Sử dụng các route
app.use('/notification', notificationRoute);
app.use('/notificationHistory', notificationHistoryRoute);

app.use((req, res, next) => {
    const error = new Error("not found");
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    const status = error.status || 500;
    const message = error.message || "Internal Server Error";
    return res.status(status).json({ message})
})

const port = 8003;
app.listen(port, console.log(`Listening on port ${port}...`));