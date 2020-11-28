const { approachesRef, firestore } = require("./common");
const { v4 } = require("uuid");
const { findLandmark } = require("./locations");

module.exports = {
  getApproach: async (id) => {
    const approach = (await approachesRef.doc(id).get()).data();
    return { ...approach, id };
  },
  createApproach: async (approach) => {
    const id = v4();
    await approachesRef.doc(id).set({ ...approach });
    return { ...approach, locations: [], id, verified: false };
  },
  addLocation: async ({ id, location }) => {
    const response = await approachesRef
      .doc(id)
      .update({ locations: firestore.FieldValue.arrayUnion(location) });

    const { verified } = (await approachesRef.doc(id).get()).data();

    if (!verified) {
      const { altitude, longitude } = location;

      const nearestLandmark = findLandmark({ altitude, longitude });

      if (nearestLandmark) {
        // TODO
        // Ask user to send photo from landmark
      }
    }
  },
  verifyPhoto: async ({ id, photo }) => {
    // TODO
    // Two possibilities:
    // a. ) Save photo base64 encoded in db
    // b. ) Save to Firebase Storage as `${id}.png`

    await approachesRef.doc(id).update({ verified: true });
  },
};
