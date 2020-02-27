const express = require("express");
const connectionDB = require("./app");
const cors = require("cors");

const app = express();

connectionDB();
//cors
app.use(cors());
//en que me de heroku o 4000
const PORT = process.env.PORT || 4000;
//middlewares
app.use(express.json({ extended: true }));

//routes
app.use("/api", require("./routes/auth"));
app.use("/api", require("./routes/project"));
app.use("/api", require("./routes/task"));

app.listen(PORT, () => {
  console.log(`Server is runnning in the port ${PORT}`);
});
