const { challengesRef } = require("./common");
const { v4 } = require("uuid");
const {
  getSumOfGroupApproaches,
  getGroupsWithUser,
  getGroup,
} = require("./groups");

module.exports = {
  getChallenge: async (id) => {
    const challenge = (await challengesRef.doc(id).get()).data();
    const scores = await Promise.all(
      challenge.groups.map(async (group) => {
        const group = await getGroup(group);
        const score = await getSumOfGroupApproaches(group);
        return { score, group_id: group, group_name: group.name };
      })
    );
    return { ...challenge, scores, id };
  },

  createChallenge: async (challenge) => {
    const id = v4();
    await challengesRef.doc(id).set({ ...challenge, groups: [] });
    return { ...challenge, groups: [], id };
  },

  addGroup: async ({ challenge_id, group_id }) => {
    const challenge = (await challengesRef.doc(id).get()).data();
    await challengesRef
      .doc(challenge_id)
      .update({ groups: [...challenge.groups, group_id] });
  },

  getAdminChallenges: async (id) => {
    const response = await challengesRef.where("admin_id", "==", id).get();
    if (response.empty) return [];

    const challenges = response.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return challenges;
  },

  getUserChallenges: async (id) => {
    const groups = (await getGroupsWithUser(id)).map((group) => group.id);
    const challenges = [];
    for await (const group of groups) {
      const temp = await challengesRef
        .where("groups", "array-contains", group)
        .get();
      if (!temp.empty)
        challenges.push([
          ...temp.map((challenge) => ({
            id: challenge.id,
            ...challenge.data(),
          })),
        ]);
    }
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
