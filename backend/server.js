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

// app.use(cors({
//     origin: ['https://stock-trade-57je.vercel.app', 'http://localhost:3000'],
//     credentials: true,
//   }));
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
    console.log("🔐 Login API called:", req.body);
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
    const { symbol } = req.query;
    const POLYGON_API_KEY = process.env.POLYGON_API_KEY;
    const POLYGON_URL = symbol

        ? `https://api.polygon.io/v2/reference/news?ticker=${symbol}&limit=12&apiKey=${POLYGON_API_KEY}`
        : `https://api.polygon.io/v2/reference/news?limit=12&apiKey=${POLYGON_API_KEY}`;
    try {
        const response = await axios.get(POLYGON_URL);
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching data from Polygon.io:', error.message);
        res.status(500).json({ message: "Failed to fetch data", error: error.message });
    }
});


app.get("/api/stock/:symbol", passport.authenticate('jwt', { session: false}), async (req,res) => {
    const { symbol } = req.params;
    const { from: fromDate, to: toDate, multiplier, timespan } = req.query;

    const POLYGON_API_KEY = process.env.POLYGON_API_KEY;
    const POLYGON_URL = `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/${multiplier}/${timespan}/${fromDate}/${toDate}?apiKey=${POLYGON_API_KEY}`;

    try {
        const response = await axios.get(POLYGON_URL);
        if (!response.data || !response.data.results) {
            return res.status(404).json({ message: "No data found for the given symbol and date range." });
        }
        res.status(200).json(response.data);
    } catch (error) {
         console.error('Error fetching data from Polygon.io:', error.message);
        res.status(500).json({ message: "Failed to fetch data", error: error.message });
    }
});

app.get("/api/dividends/:symbol", passport.authenticate('jwt', { session: false}), async (req,res) => {
    const { symbol } = req.params;
    
    const POLYGON_API_KEY = process.env.POLYGON_API_KEY;
    const POLYGON_URL = `https://api.polygon.io/v3/reference/dividends?ticker=${symbol}&limit=20&apiKey=${POLYGON_API_KEY}`;
   
    try {
        const response = await axios.get(POLYGON_URL);
        if (!response.data || !response.data.results) {
            return res.status(404).json({ message: "No data found for the given symbol." });
        }
        res.status(200).json(response.data);
    } catch (error) {
         console.error('Error fetching data from Polygon.io:', error.message);
        res.status(500).json({ message: "Failed to fetch data", error: error.message });
    }
});

app.get("/api/favourites", passport.authenticate('jwt', { session: false }), async (req, res) => {
    const userId = req.user._id;
    
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        res.status(200).json({ favourites: user.favourites });
    } catch (error) {
        console.error('Error fetching favourites:', error.message);
        res.status(500).json({ message: "Failed to fetch favourites.", error: error.message });
    }
});


app.post("/api/favourites", passport.authenticate('jwt', { session: false}), async (req,res) => {
    const { symbol } = req.body;
    const userId = req.user._id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.favourites.includes(symbol)) {
            user.favourites.push(symbol);
            await user.save();
        }

        res.status(200).json({ message: `${symbol} added to favourite` });

    } catch (error) {
        console.error('Error adding to favourites: ', error.message);
        res.status(500).json({ message: 'Failed to add to favourites. ', error: error.message });
    
    }
});

app.delete("/api/favourites/:symbol", passport.authenticate('jwt', { session: false}), async (req,res) => {
    const { symbol } = req.params;
    const userId = req.user._id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.favourites = user.favourites.filter(fav => fav !== symbol);
        await user.save();

        res.status(200).json({ message: `${symbol} removed from favourites.` });

    } catch {
        console.error('Error removing to favourites: ', error.message);
        res.status(500).json({ message: 'Failed to remove to favourites. ', error: error.message });
    }

});

app.get("/api/favourites/:symbol", passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { symbol } = req.params;
    const userId = req.user._id;

    try {
        const user = await User.findById(userId);
        const isFavourite = user.favourites.includes(symbol);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        res.status(200).json({ isFavourite });
    } catch (error) {
        console.error('Error fetching favourites:', error.message);
        res.status(500).json({ message: "Failed to fetch favourites.", error: error.message });
    }
});

app.use((req,res) => {
    res.status(404).end();
});

app.listen(HTTP_PORT, () => {
    console.log(`Server running on port ${HTTP_PORT}`);
});