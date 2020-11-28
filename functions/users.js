const { v4 } = require("uuid");
const { usersRef } = require("./common");

module.exports = {
  loginUser: async (mail) => {
    const snapshot = await usersRef.where("mail", "==", mail).get();

    if (snapshot.empty) {
      const id = await createUser(mail);
      return id;
    }

    return snapshot.docs[0].id;
  },

  getUser: async (id) => {
    const user = (await usersRef.doc(id).get()).data();
    return { ...user, id };
  },

  createUser: async (mail) => {
    const id = v4();
    await usersRef.doc(id).set({ mail });
    return id;
  },

  updateUser: async (id, data) => {
    await usersRef.doc(id).update({ ...data });
  },
};
