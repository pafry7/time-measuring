// everything ready here

const got = require("got");
const { DB_URL } = require("./common");

const PRECISION = 0.001;

module.exports = {
  findLandmark: async ({ latitude, longitude }) => {
    const variables = {
      Left: latitude - PRECISION,
      Right: latitude + PRECISION,
      Up: longitude + PRECISION,
      Down: longitude - PRECISION,
    };
    const query = `
      query MyQuery($Left:numeric,$Right:numeric,$Up:numeric,$Down:numeric, ) {
        landmarks(where: {latitude: {_gt: $Down,  _lt: $Up}, longitude: {_gt: $Left, _lt:  $Right}}) {
          id
          latitude
          longitude
          name
        }
      }
    `;
    const { landmarks } = (
      await got.post(DB_URL, {
        body: JSON.stringify({ query, variables }),
      })
    ).data;
    return landmarks && landmarks[0];
  },
};
