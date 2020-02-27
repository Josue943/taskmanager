const mongoose = require("mongoose");
require("dotenv").config({ path: "variables.env" });

const connectionDB = async () => {
  try {
    await mongoose.connect(process.env.DB_MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    });
    console.log("Connected");
  } catch (error) {
    console.log(error);
    process.exit(1); //en caso de dar error se detiene
  }
};
mongoose.set("useCreateIndex", true);

module.exports = connectionDB;
