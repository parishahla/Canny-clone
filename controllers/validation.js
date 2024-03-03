import { getDb } from "../db";

// validationLevel = strict
// collmod: adds validation to an existing documrent

getDb()
  .db()
  .runCommand({
    collMod: "users",
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["username", "email", "password"],
        properties: {
          username: {
            bsonType: "string",
            description: "must be a string and is required",
          },
          email: {
            bsonType: "string",
            pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
            description: "must be a valid email address",
          },
          password: {
            bsonType: "string",
            minLength: 8,
            description:
              "must be a string of at least 8 characters, and is required",
          },
        },
      },
    },
  })
  .then((res) => console.log(res))
  .catch((err) => console.log(err));
