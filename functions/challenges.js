const { challengesRef, firestore } = require("./common");
const { v4 } = require("uuid");
const { getSumOfGroupApproaches } = require("./groups");

module.exports = {
  getChallenge: async (id) => {
    const challenge = (await challengesRef.doc(id).get()).data();
    const scores = challenge.groups.map(async (group) => {
      const score = await getSumOfGroupApproaches(group);
      return { score, group_id: group };
    });
    return { ...challenge, scores, id };
  },

  createChallenge: async (challenge) => {
    const id = v4();
    await challengesRef.doc(id).set({ ...challenge, groups: [] });
    return { ...challenge, id };
  },

  addGroup: async ({ challenge_id, group_id }) => {
    const challenge = await this.getChallenge(challenge_id);
    await challengesRef
      .doc(challenge_id)
      .update({ groups: [...challenge.groups, group_id] });
  },

  getUserChallenges: async (id) => {
    const challenges = (await challengesRef.where("admin_id", "==", id).get())
      .docs()
      .map((doc) => ({ id: doc.id, ...doc.data() }));
    return challenges;
  },

  getAvailableChallenges: async () => {
    const challenges = (
      await challengesRef
        .where("end_time", "<", JSON.stringify(new Date()))
        .get()
    )
      .docs()
      .map((doc) => ({ id: doc.id, ...doc.data() }));
    return challenges;
  },
};
