const express = require("express");
const connectDB = require("./config/db");
const infoColors = require("./config/chalk/variables");
const app = express();
const path = require("path");

// Connect database
connectDB();

// Init Middleware
app.use(express.json());

// Define routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/sections", require("./routes/api/sections"));
app.use("/api/projects", require("./routes/api/projects"));
app.use("/api/columns", require("./routes/api/columns"));
app.use("/api/tasks", require("./routes/api/tasks"));
app.use("/api/auth", require("./routes/api/auth"));

// Serve static assests in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(infoColors.success(`Server started on port ${PORT}`));
});
