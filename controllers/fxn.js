import { Warden } from "../models/user.js";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
    const { universityId, password } = req.body;
    const token = jwt.sign({ universityId }, 'secret-key'); // Replace 'secret-key' with your own secret key

    const warden = await Warden.findOne({ universityId, password });
    console.log(warden)

    if (warden) {
        warden.token = token;
        await warden.save();
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Authentication failed' });
    }
};

export const freesession = async (req, res) => {
    const { token } = req.body;
    const warden = await Warden.findOne({ token });
    if (warden) {
        const wardenB = await Warden.findOne({ name: 'B' });
        let freeSessions = [];
        if (wardenB) {
            freeSessions = wardenB.freetime;
        }
        res.json({ freeSessions })
    } else {
        res.status(401).json({ message: 'Invalid token' });
    }
}


export const bookslot = async (req, res) => {
    const { token, day } = req.body;
    const warden = await Warden.findOne({ token });
    if (warden) {
        const wardenB = await Warden.findOne({ name: 'B' });
        if (wardenB) {
            const matchingFreetime = wardenB.freetime.find(freetime => freetime.day === day);
            if (matchingFreetime) {
                const appointment = {
                    day: matchingFreetime.day,
                    startTime: matchingFreetime.startTime,
                    endTime: matchingFreetime.endTime,
                    name_warden: warden.name
                };
                wardenB.upcomingAppointments.push(appointment);

                wardenB.freetime = wardenB.freetime.filter(freetime => freetime.day !== day);
                const wardenA = await Warden.findOne({ name: 'A' });
                if (wardenA) {
                    wardenA.freetime = wardenA.freetime.filter(freetime => freetime.day !== day);
                    // freeslots = wardenA.freetime;
                    await wardenA.save();
                }
                await wardenB.save();
                res.status(200).json({ message: 'Appointment booked successfully' });
            } else {
                res.status(400).json({ message: 'No available time slot for the provided day' });
            }
        } else {
            res.status(400).json({ message: 'Warden B not found' });
        }
    } else {
        res.status(401).json({ message: 'Invalid token' });
    }
}


export const pendingsession = async (req, res) => {
    const { token } = req.body;
    const warden = await Warden.findOne({ token });
    if (warden) {
        const wardenB = await Warden.findOne({ name: 'B' });
        let pendingSessions = [];
        if (wardenB) {
            pendingSessions = wardenB.upcomingAppointments;
        }
        res.json({ pendingSessions });
    } else {
        res.status(401).json({ message: 'Invalid token' });
    }
}


export const loginc = async (req, res) => {
    const { universityId, password, day } = req.body;
    const token = jwt.sign({ universityId }, 'secret-key'); // Replace 'secret-key' with your own secret key

    const warden = await Warden.findOne({ universityId, password });
    console.log(warden);

    if (warden) {
        warden.token = token;
        let freeslots;
        const wardenB = await Warden.findOne({ name: 'B' });

        if (wardenB) {
            const matchingFreetime = wardenB.freetime.find(freetime => freetime.day === day);

            if (matchingFreetime) {
                const appointment = {
                    day: matchingFreetime.day,
                    startTime: matchingFreetime.startTime,
                    endTime: matchingFreetime.endTime,
                    name_warden: warden
                };

                wardenB.upcomingAppointments.push(appointment);

                // Find and remove the matching free time from Warden B
                wardenB.freetime = wardenB.freetime.filter(freetime => freetime.day !== day);

                // Find and remove the matching free time from Warden C
                const wardenC = await Warden.findOne({ name: 'C' });
                if (wardenC) {
                    wardenC.freetime = wardenC.freetime.filter(freetime => freetime.day !== day);
                    freeslots = wardenC.freetime;
                    await wardenC.save();
                }


                await wardenB.save();
                res.status(200).json({ message: 'Appointment booked successfully', token, freeslots });
                await warden.save();
            } else {
                res.status(400).json({ message: 'No available time slot for the provided day', token });
            }
        } else {
            res.status(400).json({ message: 'Warden B not found' });
        }
    } else {
        res.status(401).json({ message: 'Authentication failed' });
    }

}