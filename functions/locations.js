const { landmarksRef } = require("./common");

const PRECISION = 0.001;

module.exports = {
  findLandmark: async ({ altitude, longitude }) => {
    const landmarksByAltitudeResponse = await landmarksRef
      .where("altitude", ">", altitude - PRECISION)
      .where("altitude", "<", altitude + PRECISION)
      .get();
    const landmarksByAltitude = landmarksByAltitudeResponse.empty
      ? []
      : landmarksByAltitudeResponse.docs().map((doc) => doc.id);

    const landmarksByLongitudeResponse = await landmarksRef
      .where("longitude", ">", longitude - PRECISION)
      .where("longitude", "<", longitude + PRECISION)
      .get();
    const landmarksByLongitude = landmarksByLongitudeResponse.empty
      ? []
      : landmarksByLongitudeResponse.docs().map((doc) => doc.id);

    const landmarks = landmarksByAltitude.filter((landmark) =>
      landmarksByLongitude.includes(landmark)
    );
    return landmarks && landmarks[0];
  },
};
