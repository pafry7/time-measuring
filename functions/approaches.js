const { approachesRef, firestore } = require("./common");
const { v4 } = require("uuid");
const { findLandmark } = require("./locations");
const locations = require("./locations");
const { getChallenge } = require("./challenges");
const { reduce } = require;
const KmInDegree = 111;

module.exports = {
  getApproach: async (id) => {
    const approach = (await approachesRef.doc(id).get()).data();
    const duration =
      approach.locations[locations.length - 1].timestamp.getTime() -
      approach.locations[0].timestamp.getTime();
    return { ...approach, duration, id };
  },
  createApproach: async (approach) => {
    const challenge = await getChallenge(approach.challenge_id);
    if (JSON.parse(challenge.start_time) > new Date())
      throw new Error("Challenge not started yet");

    const id = v4();
    await approachesRef.doc(id).set({ ...approach });
    return { ...approach, locations: [], id, verified: false };
  },
  getSumOfPlayerApproaches: async (id) => {
    const response = await approachesRef.where("player_id", "==", id).get();
    if (response.empty) return 0;

    const approaches = response.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    let distance = 0;
    for (const approach of approaches) {
      distance += approach.distance;
    }
    return distance;
  },
  addLocation: async ({ id, location }) => {
    const approach = (await approachesRef.doc(id).get()).data();
    const response = await approachesRef
      .doc(id)
      .update({ locations: [...approach.locations, location] });

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
  getUserApproaches: async (id) => {
    const approaches = await approachesRef.where("player_id", "==", id).get();
    if (approaches.empty) return [];
    else {
      return approaches.docs.map((doc) => {
        const doc_details = doc.data();
        const duration =
          doc_details.locations[locations.length - 1].timestamp.getTime() -
          doc_details.locations[0].timestamp.getTime();
        return { id: doc.id, ...doc_details, duration };
      });
    }
  },
  endApproach: async (id) => {
    const { locations } = (await approachesRef.doc(id).get()).data();

    let distance = 0;
    let recentParams = {
      altitude: locations[0].altitude,
      longitude: locations[0].longitude,
      elevation: locations[0].elevation,
    };
    for (const location of locations) {
      const step = Math.sqrt(
        Math.pow(
          Math.abs(location.altitude - recentParams.altitude) * KmInDegree,
          2
        ) +
          Math.pow(
            Math.abs(location.longitude - recentParams.longitude) * KmInDegree,
            2
          ) +
          Math.pow(math.abs(location.elevation - recentParams.elevation), 2)
      );
      recentParams = {
        ...location,
      };
      distance += step;
    }

    await approachesRef.doc(id).update({ distance });
    return;
  },
};
