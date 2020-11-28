const { groupsRef } = require("./common");
const { v4 } = require("uuid");
const { getSumOfPlayerApproaches } = require("./approaches");
const { response } = require("express");

module.exports = {
  getGroup: async (id) => {
    const group = (await groupsRef.doc(id).get()).data();
    return { ...group, id };
  },
  createGroup: async (group) => {
    const id = v4();
    await groupsRef.doc(id).set({ ...group, members: [] });
    return { ...group, id };
  },
  addMember: async ({ user_id, group_id }) => {
    const group = (await groupsRef.doc(group_id).get()).data();
    const response = await groupsRef.doc(group_id).update({
      members: [...group.members, user_id],
    });
  },
  getGroupsWithUser: async (id) => {
    const response = await groupsRef
      .where("members", "array-contains", id)
      .get();
    if (response.empty) return [];

    return response.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  },
  getSumOfGroupApproaches: async (id) => {
    const members = (await groupsRef.doc(id).get()).data().members;
    let distance = 0;
    for await (const member of members) {
      const memberDistance = await getSumOfPlayerApproaches(member);
      distance += memberDistance;
    }
    return distance;
  },
};
