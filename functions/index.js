const admin = require("firebase-admin");
admin.initializeApp();

const functions = require("firebase-functions");

const { addLocation, createActivity } = require("./activities");
const { addPhoto } = require("./photos");

const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors({ origin: true }));

app.get("/", (_, res) => res.send("Hello!"));

app.post("/activities", async (req, res) => {
  res.send(await createActivity({ ...req }));
});

app.post("/activities/:id/location", async (req, res) => {
  const { ...location } = req.body;
  res.send(await addLocation({ id, location }));
});

app.post("/activities/:id/photo", async (req, res) => {
  const { photo } = req.body;
  await addPhoto({ id, photo });

  res.send("Photo accepted to verification.");
});

app.post("/activities/:id/final", async (req, res) => {
  res.send(await endActivity(req.params.id));
});

exports.app = functions.https.onRequest(app);
