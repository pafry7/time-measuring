// const { Firestore } = require("@google-cloud/firestore");
const admin = require('firebase-admin');

const firestore = admin.firestore();
const usersRef = firestore.collection("users");
const landmarksRef = firestore.collection("landmarks");
const challengesRef = firestore.collection("challenges");
const groupsRef = firestore.collection("groups");
const takesRef = firestore.collection("takes");

module.exports = {
  firestore,
  usersRef,
  landmarksRef,
  challengesRef,
  takesRef,
  groupsRef
};
