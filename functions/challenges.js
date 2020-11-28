const { challengesRef, firestore } = require("./common");
const { v4 } = require("uuid");
const { getSumOfGroupApproaches } = require("./groups");

module.exports = {
  getChallenge: async (id) => {
    const challenge = (await challengesRef.doc(id).get()).data();
    const scores = challenge.groups.map(async (group) => {
      const score = await getSumOfGroupApproaches(group);
      return { score, group_id: group, group_name: group.name };
    });
    return { ...challenge, scores, id };
  },

  createChallenge: async (challenge) => {
    const id = v4();
    await challengesRef.doc(id).set({ ...challenge, groups: [] });
    return { ...challenge, id };
  },

  addGroup: async ({ challenge_id, group_id }) => {
    const challenge = (await challengesRef.doc(id).get()).data();
    await challengesRef
      .doc(challenge_id)
      .update({ groups: [...challenge.groups, group_id] });
  },

  getUserChallenges: async (id) => {
    const response = await challengesRef.where("admin_id", "==", id).get();
    if (response.empty) return [];

    const challenges = response.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return challenges;
  },

  getAvailableChallenges: async () => {
    const response = await challengesRef
      .where("end_time", "<", JSON.stringify(new Date()))
      .get();
    if (response.empty) return [];

    const challenges = response.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return challenges;
  },
};
