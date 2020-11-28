const { v4 } = require("uuid");
const {usersRef} = require("./common")
const loginUser = async (mail) => {
  const snapshot = await usersRef.where("mail", "==", mail).get();

  if (snapshot.empty) {
    const id = await createUser(mail);
    return id;
  }

  return snapshot.docs[0].id;
};

const createUser = async (mail) => {
  const id = v4();
  await usersRef.doc(id).set({ mail });
  return id;
};

module.exports = {
  loginUser,
};
