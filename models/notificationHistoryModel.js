const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NotificationHistorySchema = new Schema({
    user_id: {
        // type: Schema.Types.ObjectId,
        type: String,
        required: true
    },
    list_notification: {
        type: [
            {
                status: {
                    type: String,
                    required: true
                },
                type: {
                    type: String,
                    required: true
                },
                notification: {
                    type: String,
                    required: true
                }
            }
        ],
        required: true
    }
});

module.exports = NotificationHistory = mongoose.model("notificationHistory", NotificationHistorySchema);