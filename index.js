const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

//routes
const userRoute = require("./routes/userRoute");
const cartRoute = require("./routes/cartRoute");
const orderRoute = require("./routes/orderRoute");
const productRoute = require("./routes/productRoute");
const authRoute = require("./routes/authRoute");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

mongoose
  .connect(
    `mongodb+srv://simpleEcom:${process.env.MONGO_PASSWORD}@cluster0.91fkmpl.mongodb.net/eCommerce?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("DB connected..");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/api/auth", authRoute);
app.use("/api/user", authRoute);
app.use("/api/user", userRoute);
app.use("/api/product", productRoute);
app.use("/api/order", orderRoute);
app.use("/api/cart", cartRoute);

app.listen(PORT, () => {
  console.log("server running...");
});
