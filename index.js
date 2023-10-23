import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import router from "./routes/variousroutes.js";

const app = express();

mongoose.connect('mongodb+srv://lakshayarora0612:Lakshya123@cluster0.cdoonzh.mongodb.net/Assignment', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());


app.use('/api/', router);

app.get('/', (req, res) => {
    res.send('Hello world')
})


app.listen(8000, () => {
    console.log("Server is running on port 8000");
})