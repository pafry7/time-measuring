const { Firestore } = require("@google-cloud/firestore");
const { v4 } = require("uuid");

const firestore = new Firestore();
const usersRef = firestore.collection("users");

const loginUser = async (mail) => {
  const users = [];

  const snapshot = await usersRef.where("mail", "==", mail).get();

  if (snapshot.empty) {
    console.log("No matching documents.");
    return;
  }

  snapshot.forEach((doc) => {
    users.push({ id: doc.id, data: doc.data() });
  });

  return users;
};

const createUser = async (mail) => {
  const id = v4();
  await usersRef.doc(id).set({ mail });
};

module.exports = {
  loginUser,
};
