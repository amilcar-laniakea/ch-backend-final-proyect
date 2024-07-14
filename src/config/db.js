const mongoose = require("mongoose");

const db = mongoose.connection;

const dbConnect = async () => {
  try {
    await mongoose.connect(
      `${process.env.MONGO_DB_URI}${process.env.DATABASE_NAME}`,
      {}
    );
    console.log("success: connected to database!");
  } catch (error) {
    console.error("error:", error.message);
    process.exit(1);
  }
};

const dbError = db.on("error", (err) => {
  console.log(err);
});

module.exports = { dbConnect, dbError };
