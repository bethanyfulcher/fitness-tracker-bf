const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WeekSchema = new Schema({
    name: String,
    exercises: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Exercise'
        }
    ]
})

const Week = mongoose.model("Week", WeekSchema);

module.exports = Week;