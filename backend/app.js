const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require('./models/user');
const Vehicle = require('./models/vehicle');
const { user } = require("./config/db.config");

const app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Passport middleware
app.use(passport.initialize());
// Passport config
require("./passport")(passport);

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, 'secret', (err, user) => {
    console.log(err)

    if (err) return res.sendStatus(403)

    req.user = user

    next()
  })
}

app.post('/login', async(req, res) => {
  const rows = await User.find(req.body.username, req.body.password);
  if ( rows.length === 0) {
    res.send({
      success: false
    })
    return;
  }
  jwt.sign(
    {
      id: rows[0].id,
      username: rows[0].username
    },
    'secret',
    {
      expiresIn: 300 // 1 year in seconds
    },
    (err, token) => {
      res.send({
        success: true,
        token: "Bearer " + token
      });
    }
  );
});

app.get("/user", authenticateToken, async (req, res) => {
  const rows = await User.findAll();
  res.send(rows);
});

app.get("/user/:id", authenticateToken, async (req, res) => {
  const rows = await User.findById(req.params.id);
  res.json({ message: rows });
});

app.post("/user/update", authenticateToken, async (req, res) => {
  const rows = await User.update(req.body.id, req.body.updates);
  res.send(rows);
});

app.post("/user/insert", authenticateToken, async (req, res) => {
  const result = await User.insert(req.body);
  res.send(result);
});

app.post("/user/delete", authenticateToken, async (req, res) => {
  const result = await User.delete(req.body.id);
  res.send(result);
});


app.get("/vehicle", authenticateToken, async (req, res) => {
  const rows = await Vehicle.findAll();
  res.send(rows);
});

app.post('/vehicle/update', authenticateToken, async (req, res) => {
  const rows = await Vehicle.update(req.body.id, req.body.updates);
  res.send(rows);
})

app.listen(3001, () => {
  console.log("Hello");
});