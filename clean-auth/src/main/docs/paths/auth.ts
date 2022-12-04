export const signUpPath = {
  post: {
    tags: ["Autenticação"],

    requestBody: {
      description: "body",
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              name: {
                type: "string",
                required: true,
              },
              email: {
                type: "string",
                required: true,
              },
              password: {
                type: "string",
                required: true,
              },
            },
          },
        },
      },
    },

    responses: {
      201: {
        description: "Usuário criado com sucesso!",
      },
    },
  },
};

export const loginPath = {
  post: {
    tags: ["Autenticação"],

    requestBody: {
      description: "body",
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              email: {
                type: "string",
                required: true,
              },
              password: {
                type: "string",
                required: true,
              },
            },
          },
        },
      },
    },

    responses: {
      200: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                accessToken: {
                  type: "string",
                },
              },
            },
          },
        },
      },
    },
  },
};
