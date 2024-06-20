const mongoose = require("mongoose");
const Notification = require("../models/notificationModel");
const NotificationHistoryController = require("./notificationHistoryController");
const {
  consumer,
  consumer_booking,
  consumer_event,
} = require("../config/kafkaConfig");
const MailService = require("../helper/mail");

console.log("Starting consumer");

consumer_booking.connect();
consumer_booking.subscribe({ topic: "new_booking" });

const runConsumer_booking = async () => {
  console.log("Consumer running");
  await consumer_booking.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log("Consuming Booking service");
      try {
        const userData = JSON.parse(message.value.toString());
        console.log(userData);
        await addUserAndSendMail(userData);
      } catch (error) {
        console.error("Failed to process message", error);
      }
    },
  });
};

consumer_event.connect();
consumer_event.subscribe({ topic: "NewEvent" });

const runConsumer_event = async () => {
  console.log("Consumer running");
  await consumer_event.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log("Consuming Booking service");
      try {
        const eventData = JSON.parse(message.value.toString());
        console.log(eventData);
        await sendNotificationEvent(eventData);
      } catch (error) {
        console.error("Failed to process message", error);
      }
    },
  });
};

// const addUserAndSendMail = async (req, res) => {
const addUserAndSendMail = async (userData) => {
  if (!userData) {
    console.error("Error: data user is null!");
  }

  try {
    // const { owner_id, buyer_id, user_email } = req.body;
    const { event_owner, buyer_id, buyer_email } = userData;
    let owner_id = event_owner 
    let user_id = buyer_id
    let user_email = buyer_email
    let notification = await Notification.findOne({ owner_id });

    if (notification === null) {
      notification = new Notification({
        owner_id,
        list_user: [{ user_id, user_email }],
      });
    } else {
      const existingUser = notification.list_user.find(
        (user) => user.user_id.toString() === user_id.toString()
      );
      console.log(existingUser);
      if (existingUser === undefined) {
        const newUser = {
          user_id,
          user_email,
        };
        notification.list_user.push(newUser);
      }
    }

    await notification.save();

    // send email
    message = `Hi ${user_email}, your ticket has been created successfully!`;

    const notificationData = {
      user_id: user_id,
      user_email: user_email,
      status: "send",
      type: "addBookingSucessfull",
      message,
    };

    await sendNotification(notificationData);
    console.log("User added to Notification table successfully!");
  } catch (error) {
    console.error("Error adding user:", error);
  }
};

// Get user of owner_id
const getUsersByOwnerId = async (owner) => {
  try {
    const notification = await Notification.findOne({ owner_id: owner });

    if (!notification) {
      console.log("Owner_id not found in the database");
      return [];
    }

    const users = notification.list_user;
    return users;
  } catch (error) {
    console.error("Error getting users:", error);
    return [];
  }
};

// Send notification for event
const sendNotificationEvent = async (eventData) => {
  try {
    const { owner, id, name, start_date } = eventData;
    const listUser = await getUsersByOwnerId(owner);
    console.log("owner: ", owner);

    if (Array.isArray(listUser) && listUser.length > 0) {
      const message = `There is a new event ${name} on ${start_date}.`;
      // send mail
      for (const user of listUser) {
        const notificationData = {
          user_id: user.user_id,
          user_email: user.user_email,
          status: "send",
          type: "newEvent",
          message,
        };

        await sendNotification(notificationData);
      }
    } else {
      console.error("There are not user following owner");
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

// Send notification by email
const sendNotification = async (notificationData) => {
  const { user_id, user_email, status, type, message } = notificationData;

  // send mail
  MailService.SendMail(user_email, message);
  // MailService.SendMail(owner_mail, buyer_mail, message);
  console.log("send seccessfully:");
  await NotificationHistoryController.createNotificationHistory(
    notificationData
  );
};

module.exports = {
  runConsumer_booking,
  runConsumer_event,
  addUserAndSendMail,
  getUsersByOwnerId,
  sendNotificationEvent,
  sendNotification,
};
