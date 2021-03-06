const { findLandmark } = require("./locations");
const { degradeUser } = require("./users");
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
        locations: "[]",
        verified: false,
        expect_photo: false,
      },
    };
    const response = await got.post(DB_URL, {
      body: JSON.stringify({ query, variables }),
    });
    const { id } = JSON.parse(response.body).data.insert_activities_one;
    return JSON.stringify({ id });
  },

  addLocation: async ({ id, location }) => {
    const query = `
      query MyQuery {
        activities_by_pk(id:  "${id}") {
          locations
        }
      }
    `;
    const { locations } = JSON.parse(
      (await got.post(DB_URL, { body: JSON.stringify({ query }) })).body
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

    // console.log("locations in db:");
    // console.log(locations);
    // console.log("provided location:");
    // console.log(location);
    // console.log("merged locations:");
    console.log(JSON.stringify([...JSON.parse(locations), location]));
    const variables = {
      locations: JSON.stringify([...JSON.parse(locations), location]),
    };

    await got.post(DB_URL, {
      body: JSON.stringify({ query: mutation, variables }),
    });

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
          query: mutationPhoto,
          variables: variablesPhoto,
        }),
      });

      return { expect_photo: true };
    } else return { expect_photo: false };
  },

  endActivity: async (id) => {
    const query = `
      query MyQuery {
        activities_by_pk(id:  "${id}") {
          locations
        }
      }
    `;
    const { locations: locationsString } = JSON.parse(
      (await got.post(DB_URL, { body: JSON.stringify({ query }) })).body
    ).data.activities_by_pk;

    const locations = JSON.parse(locationsString);

    let distance = 0;
    let recentParams = {
      latitude: locations[0] && locations[0].latitude,
      longitude: locations[0] && locations[0].longitude,
    };
    for (const location of locations) {
      console.log("location for distance:");
      console.log(location);
      const step = Math.sqrt(
        Math.pow(
          Math.abs(location.latitude - recentParams.latitude) * KmInDegree,
          2
        ) +
          Math.pow(
            Math.abs(location.longitude - recentParams.longitude) * KmInDegree,
            2
          )
      );
      recentParams = {
        ...location,
      };
      console.log("actual step: " + step);
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

    await got.post(DB_URL, {
      body: JSON.stringify({ query: mutation, variables }),
    });

    const queryPhoto = `
      query MyQuery {
        activities_by_pk(id: "${id}") {
          expect_photo
        }
      }
    `;

    const { expect_photo } = JSON.parse(
      (
        await got.post(DB_URL, {
          body: JSON.stringify({ query: queryPhoto }),
        })
      ).body
    ).data.activities_by_pk;

    if (!expect_photo) {
      const queryUser = `
        query MyQuery {
          activities_by_pk(id: "${id}") {
            user_id
          }
        }
    `;
      const { user_id } = JSON.parse(
        (
          await got.post(DB_URL, {
            body: JSON.stringify({ query: queryUser }),
          })
        ).body
      ).data.activities_by_pk;
      await degradeUser(user_id);
    }

    return;
  },
};
