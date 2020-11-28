const { approachesRef, firestore } = require("./common");
const { v4 } = require("uuid");

module.exports = {
  getApproach: async (id) => {
    const approach = (await approachesRef.doc(id).get()).data();
    return { ...approach, id };
  },
  createApproach: async (approach) => {
    const id = v4();
    await approachesRef.doc(id).set({ ...approach });
    return { ...approach, id };
  },
  addLocation: async ({ id, location }) => {
    // TODO
    // check if user is near landmark
    // if so ask him, about picture

    const response = await approachesRef
      .doc(id)
      .update({ locations: firestore.FieldValue.arrayUnion(location) });
  },
};
