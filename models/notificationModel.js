const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
    owner_id: {
        // type: Schema.Types.ObjectId,
        type: String,
        required: true
    },
    list_user: {
        type: [
            {
                user_id: {
                    // type: Schema.Types.ObjectId,
                    type: String,
                    required: true
                },
                user_email: {
                    type: String,
                    required: true
                }
            }
        ],
        required: true
    }
});

module.exports = Notification = mongoose.model("notification", NotificationSchema);