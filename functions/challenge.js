const { challengesRef, firestore } = require("./common");
const { v4 } = require("uuid");

module.exports = {
  getChallenge: async (id) => {
    const challenge = (await challengesRef.doc(id).get()).data();
    return { ...challenge, id };
  },
  createChallenge: async (challenge) => {
    const id = v4();
    await challengesRef.doc(id).set({ ...challenge });
    return { ...challenge, id };
  },
  addGroup: async({challenge_id,group_id}) => {
    const response = await challengesRef.doc(challenge_id).update({
      groups: firestore.FieldValue.arrayUnion(group_id)
    });
  }
};
