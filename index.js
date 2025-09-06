import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.port || 4000;

app.get("/", (req, res) => {
  res.status(200).send("Hello I am using AWS EKS");
});

app.get("/hello", (req, res) => {
  res.status(200).send("Hello I am using AWS EKS hstysyhfjkvg");
});

app.listen(port, () => {
  console.log(`listening on ${port}`);
});
