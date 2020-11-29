module.exports = {
  addPhoto: async ({ id, photo }) => {
    // TODO
    // Two possibilities:
    // a. ) Save photo base64 encoded in db
    // b. ) Save to Firebase Storage as `${id}.png`

    const mutationPhoto = `
          mutation MyMutation($locations: String) {
            update_activities_by_pk(
              pk_columns: {id:    "${id}"}
              _set: {expect_photo: false, verified: true}
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
  },
};
