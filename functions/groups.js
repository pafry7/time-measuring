const { groupsRef, firestore } = require("./common");
const { v4 } = require("uuid");

module.exports = {
  getGroup: async (id) => {
    const group = (await groupsRef.doc(id).get()).docs()[0].data();
    return { ...group, id };
  },
  createGroup: async (group) => {
    const id = v4();
    await groupsRef.doc(id).set({ ...group });
    return { ...group, id };
  },
  addMember: async({user_id,group_id}) => {
    const response = await groupsRef.doc(group_id).update({
      members: firestore.FieldValue.arrayUnion(user_id)
    });
  }
};
