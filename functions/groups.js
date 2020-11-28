const { groupsRef, firestore } = require("./common");
const { v4 } = require("uuid");
const { getSumOfPlayerApproaches } = require("./approaches");

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
    const response = await groupsRef.doc(group_id).update({
      members: firestore.FieldValue.arrayUnion(user_id),
    });
  },
  getGroupsWithUser: async (id) => {
    return (await groupsRef.where("members", "array-contains", id).get()).map(
      (doc) => ({
        id: doc.id,
        ...doc.data(),
      })
    );
  },
  getSumOfGroupApproaches: async (id) => {
    const members = (await groupsRef.doc(id).get()).data().members;
    let distance = 0;
    for (const member of members) {
      const memberDistance = await getSumOfPlayerApproaches(member);
      distance += memberDistance;
    }
  },
};
