const { Firestore } = require("@google-cloud/firestore");
const { v4 } = require("uuid");

const firestore = new Firestore();
const usersRef = firestore.collection("users");

const loginUser = async (mail) => {
  const user = await usersRef.where("mail", "==", mail).get();
  return user;
};

const createUser = async (mail) => {
  const id = v4();
  await usersRef.doc(id).set({ mail });
};

module.exports = {
  loginUser,
};
