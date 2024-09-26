require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const passport = require("passport");
const passportJWT = require("passport-jwt");
const axios = require("axios");
const app = express();

const HTTP_PORT = process.env.PORT || 8080;

//JSON Web Token Setup
let ExtractJwt = passportJWT.ExtractJwt;
let JwtStrategy = passportJWT.Strategy;

//Configure its options
let jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
    secretOrKey: process.env.JWT_SECRET,
}

let strategy = new JwtStrategy(jwtOptions, async (jwt_payload, next) => {
    try {
        const user = await User.findById(jwt_payload._id);
        if (user) {
            next(null, { 
                _id: user._id,
                email: user.email,
            });
        } else {
        next(null, false);
        }
    } catch (err) {
        next(err, false);
    }
});

//passport middleware
// tell passport to use our "strategy"
passport.use(strategy);
// add passport as application-level middleware
app.use(passport.initialize());

// middleware
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

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ email, password: hashedPassword});
        await newUser.save();

        res.status(201).json({ message: "User created successfully"});
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }

});

app.post("/api/login", async (req,res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User does not exist"});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        } 

        //Create jwt payload
        const payload = {
            _id: user._id,
            email: user.email,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.status(200).json({ message: "Login successful", token });
        console.log('JWT Secret:', process.env.JWT_SECRET);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Add a protected route for top gainers/losers
app.get("/api/top-gainers-losers", passport.authenticate('jwt', { session: false }), async (req, res) => {
    console.log('Top Gainers Losers API called'); 
    const ALPHA_API_KEY = process.env.ALPHA_API_KEY;
    const ALPHA_URL = `https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=${ALPHA_API_KEY}`;
    try {
        const response = await axios.get(ALPHA_URL);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch data", error: error.message });
    }
});

app.get("/api/news", passport.authenticate('jwt', { session: false}), async (req,res) => {
    console.log('new api called');
    const POLYGON_API_KEY = process.env.POLYGON_API_KEY;
    const POLYGON_URL = `https://api.polygon.io/v2/reference/news?limit=12&apiKey=${POLYGON_API_KEY}`;
    try {
        const response = await axios.get(POLYGON_URL);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch data", error: error.message });
    }
});


app.get("/api/stock-data", passport.authenticate('jwt', { session: false}), async (req,res) => {
    const date = new Date();
    let day = String(date.getDate()).padStart(2, '0');
    let month = String(date.getMonth()+1).padStart(2, '0');
    let year = date.getFullYear();

    let from_date = new Date();
    from_date.setMonth(from_date.getMonth() - 6);
    let fromDay = String(from_date.getDate()).padStart(2, '0');
    let fromMonth = String(from_date.getMonth() + 1).padStart(2, '0');
    let fromYear = from_date.getFullYear();
    const TICKER = 'AAPL';
    const MULTIPLIER = '1';
    const TIMESPAN = 'day';
    //const FROM = '2024-01-05';
    const FROM = `${fromYear}-${fromMonth}-${fromDay}`;
    //const TO = '2024-09-13';
    const TO = `${year}-${month}-${day}`;

    const POLYGON_API_KEY = process.env.POLYGON_API_KEY;
    const POLYGON_URL = `https://api.polygon.io/v2/aggs/ticker/${TICKER}/range/${MULTIPLIER}/${TIMESPAN}/${FROM}/${TO}?apiKey=${POLYGON_API_KEY}`;
    try {
        const response = await axios.get(POLYGON_URL);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch data", error: error.message });
    }
});

app.use((req,res) => {
    res.status(404).end();
});

app.listen(HTTP_PORT, () => {
    console.log(`Server running on port ${HTTP_PORT}`);
});