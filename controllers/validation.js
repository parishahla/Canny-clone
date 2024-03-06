import { getDb } from "../db";
import logger from "../logger/logger";

// validationLevel = strict
// collmod: adds validation to an existing documrent

//* Modified the users collection
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
          photo: {
            bsonType: "string",
          },
        },
      },
    },
  })
  .then((res) => logger.info(res))
  .catch((err) => logger.error(err));

const feedbackSchema = {
  $jsonSchema: {
    bsonType: "object",
    required: ["title", "desc"],
    properties: {
      title: {
        bsonType: "string",
        minLength: 10,
        description: "must be a string and is required",
      },
      desc: {
        bsonType: "string",
        minLength: 20,
        description:
          "must be a string of at least 20 characters, and is required",
      },
    },
  },
};
//* Modified the feedback collection
getDb()
  .db()
  .runCommand({
    collMod: "feedbacks",
    validator: feedbackSchema,
    validationLevel: "strict",
  })
  .then((res) => logger.info(res))
  .catch((err) => logger.error(err));

//   // Define the JSON schema for validation
// const schema = {
//   $jsonSchema: {
//     bsonType: 'object',
//     required: ['name', 'age'], // Example required fields
//     properties: {
//       name: {
//         bsonType: 'string',
//         description: 'must be a string and is required'
//       },
//       age: {
//         bsonType: 'int',
//         minimum: 0,
//         description: 'must be an integer and is required'
//       },
//       // Add more properties and validation rules as needed
//     }
//   }
// };

// // Update the collection's options with validation rules using collMod
// db.runCommand({
//   collMod: 'your-collection-name',
//   validator: schema,
//   validationLevel: 'strict' // 'strict' enforces validation rules for all inserts and updates
// });
