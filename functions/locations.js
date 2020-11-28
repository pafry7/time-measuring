const { landmarksRef } = require("./common");

const PRECISION = 0.001;

module.exports = {
  findLandmark: async ({ altitude, longitude }) => {
    const landmarksByAltitude = (
      await landmarksRef
        .where("altitude", ">", altitude - PRECISION)
        .where("altitude", "<", altitude + PRECISION)
        .get()
    )
      .docs()
      .map((doc) => doc.id);

    const landmarksByLongitude = (
      await landmarksRef
        .where("longitude", ">", longitude - PRECISION)
        .where("longitude", "<", longitude + PRECISION)
        .get()
    )
      .docs()
      .map((doc) => doc.id);

    const landmarks = landmarksByAltitude.filter((landmark) =>
      landmarksByLongitude.includes(landmark)
    );
    return landmarks?.[0];
  },
};
