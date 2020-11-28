const admin = require("firebase-admin");
admin.initializeApp();

const functions = require("firebase-functions");
const { loginUser, getUser, updateUser } = require("./users");
const {
  getChallenge,
  createChallenge,
  addGroup,
  getUserChallenges,
  getAdminChallenges,
} = require("./challenges");
const { getGroup, createGroup, addMember } = require("./groups");
const {
  addLocation,
  verifyPhoto,
  getUserApproaches,
  getApproach,
} = require("./approaches");

const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors({ origin: true }));

app.get("/", (_, res) => res.send("Hello!"));

// ---------- Users
app.post("/hello", async (req, res) => {
  const { mail } = req.body;
  res.send({ id: await loginUser(mail) });
});

app.get("/users/:id", async (req, res) => {
  res.send(await getUser(req.params.id));
});

app.get("/users/:id/challenges", async (req, res) => {
  res.send(await getUserChallenges(req.params.id));
});

app.get("/users/:id/admin_challenges", async (req, res) => {
  res.send(await getAdminChallenges(req.params.id));
});

app.get("/users/:id/approaches", async (req, res) => {
  res.send(await getUserApproaches(req.params.id));
});

app.patch("/users/:id", async (req, res) => {
  const { ...user } = req.body;
  res.send(await updateUser({ id: req.params.id, user }));
});

// ---------- Challenges
app.get("/challenges/:id", async (req, res) => {
  res.send(await getChallenge(req.params.id));
});

app.get("/challenges", async (req, res) => {
  res.send(await getAvailableChallenges());
});

app.post("/challenges", async (req, res) => {
  const { ...challenge } = req.body;
  res.send(await createChallenge(challenge));
});

app.post("/challenges/:id/groups", async (req, res) => {
  const { group_id } = req.body;
  res.send(await addGroup({ challenge_id: req.params.id, group_id }));
});

// ---------- Groups
app.get("/groups/:id", async (req, res) => {
  res.send(await getGroup(req.params.id));
});

app.post("/groups", async (req, res) => {
  const { ...group } = req.body;
  res.send(await createGroup(group));
});

app.post("/groups/:id/members", async (req, res) => {
  const { user_id } = req.body;
  res.send(await addMember({ group_id: req.params.id, user_id }));
});

// ---------- Approaches
app.get("/approaches/:id", async (req, res) => {
  res.send(await getApproach(req.params.id));
});

app.post("/approaches", async (req, res) => {
  const { ...approach } = req.body;
  res.send(await createApproach(approach));
});

app.post("/approaches/:id/location", async (req, res) => {
  const { ...location } = req.body;
  res.send(await addLocation({ id, location }));
});

app.post("/approaches/:id/verify", async (req, res) => {
  const { photo } = req.body;
  await verifyPhoto({ id, photo });

  res.send("Photo accepted to verification.");
});

app.post("/approaches/:id/final", async (req, res) => {
  res.send(await endApproach(req.params.id));
});

exports.app = functions.https.onRequest(app);
