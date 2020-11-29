const { findLandmark } = require("./locations");

const got = require("got");
const { DB_URL } = require("./common");
const KmInDegree = 111;

module.exports = {
  createActivity: async (activity) => {
    const query = `
      mutation MyMutation($object: activities_insert_input!) {
        insert_activities_one(object: $object) {
          id
        }
      }
    `;
    const variables = {
      object: {
        ...activity,
        verified: false,
        expect_photo: false,
      },
    };
    const response = await got.post(DB_URL, {
      body: JSON.stringify({ query, variables }),
    });
    const { id } = response.data.insert_activities_one;
    return id;
  },

  addLocation: async ({ id, location }) => {
    const query = `
      query MyQuery {
        activities_by_pk(id:  "${id}") {
          locations
        }
      }
    `;
    const { locations } = (
      await got.post(DB_URL, { body: JSON.parse({ query }) })
    ).data.activities_by_pk;

    const mutation = `
      mutation MyMutation($locations: String) {
        update_activities_by_pk(
          pk_columns: {id:    "${id}"}
          _set: {locations: $locations}
        ) {
          locations
        }
      }
    `;
    const variables = {
      locations: JSON.stringify([...JSON.parse(locations), location]),
    };

    await got.post(DB_URL, { body: JSON.stringify({ mutation, variables }) });

    const { latitude, longitude } = location;

    const nearestLandmark = await findLandmark({ latitude, longitude });

    if (nearestLandmark) {
      const mutationPhoto = `
        mutation MyMutation($locations: String) {
          update_activities_by_pk(
            pk_columns: {id:    "${id}"}
            _set: {expect_photo: true}
          ) {
            locations
          }
        }
    `;
      const variablesPhoto = {
        locations: JSON.stringify([...JSON.parse(locations), location]),
      };

      await got.post(DB_URL, {
        body: JSON.stringify({
          mutation: mutationPhoto,
          variables: variablesPhoto,
        }),
      });

      return { expect_photo: true };
    } else return;
  },

  endActivity: async (id) => {
    const query = `
      query MyQuery {
        activities_by_pk(id:  "${id}") {
          locations
        }
      }
    `;
    const { locations: locationsString } = (
      await got.post(DB_URL, { body: JSON.parse({ query }) })
    ).data.activities_by_pk;

    const locations = JSON.parse(locationsString);

    let distance = 0;
    let recentParams = {
      latitude: locations[0].latitude,
      longitude: locations[0].longitude,
      elevation: locations[0].elevation,
    };
    for (const location of locations) {
      const step = Math.sqrt(
        Math.pow(
          Math.abs(location.latitude - recentParams.latitude) * KmInDegree,
          2
        ) +
          Math.pow(
            Math.abs(location.longitude - recentParams.longitude) * KmInDegree,
            2
          ) +
          location.elevation && recentParams.elevation
          ? Math.pow(math.abs(location.elevation - recentParams.elevation), 2)
          : 0
      );
      recentParams = {
        ...location,
      };
      distance += step;
    }

    const mutation = `
      mutation MyMutation($distance: numeric) {
        update_activities_by_pk(
          pk_columns: {id: "${id}"}
          _set: {distance: $distance}
        ) {
          locations
        }
      }
    `;
    const variables = {
      distance,
    };

    await got.post(DB_URL, { body: JSON.stringify({ mutation, variables }) });

    const queryPhoto = `
      query MyQuery {
        activities_by_pk(id: "${id}") {
          expect_photo
        }
      }
    `;

    const { expect_photo } = (
      await got.post(DB_URL, {
        body: JSON.stringify({ query: queryPhoto }),
      })
    ).data.activities_by_pk;

    if (!expect_photo) {
      const queryUser = `
        query MyQuery {
          activities_by_pk(id: "${id}") {
            user_id
          }
        }
    `;
      const { user_id } = (
        await got.post(DB_URL, {
          body: JSON.stringify({ query: queryUser }),
        })
      ).data.activities_by_pk;
      await degradeUser(user_id);
    }

    return;
  },
};
