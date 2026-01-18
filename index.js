require("dotenv").config();
const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;
const authRoutes = require("./src/routes/auth.routes");

app.use(express.json());
app.use("/auth/", authRoutes);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
