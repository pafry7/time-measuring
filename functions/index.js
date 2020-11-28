const functions = require("firebase-functions");
const { loginUser } = require("./users");
const { getChallenge, createChallenge } = require("./challenges");

const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors({ origin: true }));

app.get("/app", (req, res) => res.send("Hello!"));

app.post("/app/hello", async (req, res) => {
  const { mail } = JSON.parse(req.body);
  res.status(200).send({ id: await loginUser(mail) });
});

app.get("/app/challenges/:id", async (req, res) => {
  res.send(await getChallenge(req.params.id));
});

app.post("/app/challenges", async (req, res) => {
  const { ...challenge } = JSON.parse(req.body);
  res.send(await createChallenge(challenge));
});

exports.app = functions.https.onRequest(app);
