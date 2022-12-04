
export const abcPath = {
  get: {
    tags: ["Testes"],

    security: [{
      auth: []
    }],

    responses: {
      200: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                },
              },
            },
          },
        },
      },

      401: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: {
                  error: "string",
                },
              },
            },
          },
        },
      },
    },
  },
};
