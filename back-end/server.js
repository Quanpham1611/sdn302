const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./router/auth");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
