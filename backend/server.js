require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
//const jwt = require("jsonwebtoken");
//const passport = require("passport");
//const passportJWT = require("passport-jwt");
const app = express();

const HTTP_PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(
    () => console.log("Connected to MongoDB")
).catch(
    err=> console.error("Failed to connect to MongoDB: ", err)
);


app.get("/", (req, res) => {
    res.send("Welcome to the API server! Use /api/signup or /api/login");
});

app.post("/api/signup", async (req,res) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "User already exists"});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ email, password: hashedPassword});
    await newUser.save();

    res.status(201).json({ message: "User created successfully"});
});

app.post("/api/login", async (req,res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "User does not exist"});
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    res.status(200).json({ message: "Login successful", user });
});



app.listen(HTTP_PORT, () => {
    console.log(`Server running on port ${HTTP_PORT}`);
});