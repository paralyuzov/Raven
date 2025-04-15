const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const authRoutes = require("./routes/auth");
const usersRoute = require('./routes/users');
const messagesRoute = require('./routes/messages');
const setupSocket = require('./config/socketSetup');

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

const io = setupSocket(server, app);

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
})();

app.use("/api/auth", authRoutes);
app.use('/api/users', usersRoute);
app.use('/api/messages', messagesRoute);

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
