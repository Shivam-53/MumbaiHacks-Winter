const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./db/connect");
const {router} = require("./routes/shodan");
// const { errorHandler } = require("./middleware/errorMiddleware");

require("dotenv").config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));

app.use(router);
// app.set("port", process.env.PORT || 3000);
let port=process.env.port || 3000;


const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
