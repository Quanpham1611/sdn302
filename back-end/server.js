const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./router/auth");
const organizationRoutes = require("./router/organization")
const noteRoutes = require("./router/note");
const userRoutes = require("./router/user");
const notificationRoutes = require("./router/notification");
const teamRouter = require("./router/team");
const noteRouter = require("./router/note");
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
app.use("/api/organization", organizationRoutes);
app.use("/api/note", noteRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/teams", teamRouter);
app.use("/api/notes", noteRouter);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
