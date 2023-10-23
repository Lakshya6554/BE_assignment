import mongoose from "mongoose";
const wardenSchema = new mongoose.Schema({
    universityId: String,
    name: String,
    password: String,
    token: String,
    freetime: {
        type: Array,
        default: [{ day: "Thursday", startTime: "10:00 AM", endTime: "11:00 AM" }, { day: "Friday", startTime: "10:00 AM", endTime: "11:00 AM" }]
    },
    upcomingAppointments: {
        type: Array,
        default: [{}]
    }
});

export const Warden = mongoose.model('Warden', wardenSchema, "Warderns");
