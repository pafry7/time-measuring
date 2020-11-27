const { Firestore } = require("@google-cloud/firestore");
import { v4 as uuid } from "uuid";

const firestore = new Firestore();
const usersRef = firestore.collection("users");

export const loginUser = async (mail) => {
  const user = await usersRef.where("mail", "==", mail).get();
  return user;
};

const createUser = async (mail) => {
  const id = uuid();
  await usersRef.doc(id).set({ mail });
};
