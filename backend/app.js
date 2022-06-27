const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const User = require('./models/user');
const Vehicle = require('./models/vehicle');

const app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get("/user", async (req, res) => {
  const rows = await User.findAll();
  res.send(rows);
});

app.get("/user/:id", async (req, res) => {
  const rows = await User.findById(req.params.id);
  res.json({ message: rows });
});

app.post("/user/update", async (req, res) => {
  const rows = await User.update(req.body.id, req.body.updates);
  res.send(rows);
});

app.post("/user/insert", async (req, res) => {
  const result = await User.insert(req.body);
  res.send(result);
});

app.post("/user/delete", async (req, res) => {
  const result = await User.delete(req.body.id);
  res.send(result);
});


app.get("/vehicle", async (req, res) => {
  const rows = await Vehicle.findAll();
  res.send(rows);
});

app.listen(3001, () => {
  console.log("Hello");
});