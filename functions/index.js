const functions = require("firebase-functions");
const { loginUser } = require("./users");
const { getChallenge, createChallenge } = require("./challenge");

const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors({ origin: true }));

app.post("/hello", async (req, res) => {
  const { mail } = JSON.parse(req.body);
  res.status(200).send({ id: await loginUser(mail) });
});

app.get("/challenges/:id", async (req, res) => {
  res.send(await getChallenge(req.params.id));
});

app.post("/challenges", async (req, res) => {
  const { ...challenge } = JSON.parse(req.body);
  res.send(await createChallenge(challenge));
});


exports.app = functions.https.onRequest(app);
