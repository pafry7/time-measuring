const { Firestore } = require("@google-cloud/firestore");

const firestore = new Firestore();
const usersRef = firestore.collection("users");
const landmarksRef = firestore.collection("landmarks");
const challengesRef = firestore.collection("challenges");
const takesRef = firestore.collection("takes");

module.exports = {
  firestore,
  usersRef,
  landmarksRef,
  challengesRef,
  takesRef,
};
