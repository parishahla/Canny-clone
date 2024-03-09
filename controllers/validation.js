import Joi from "joi";

const userValidation = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email({
    minDomainSegments: 3,
    tlds: { allow: ["com", "net", "io"] },
  }),
  photo: Joi.string(),
  password: Joi.string(),
  passwordConfirm: Joi.string(),
});

export default userValidation;

// This piece of code is supposed to work with api v2.0.0 -
// import User from "../model/user.model.js";

// class Validate {
//   constructor(model) {
//     this.model = model;
//   }
//   async findEmail(email) {
//     return await this.model.findOne({ email: email });
//   }

//   static validateUserInput(req, res, next) {
//     let { username, email, password } = req.body;

//     // Check if all required fields are present
//     if (!username || !email || !password) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     // Validate email format
//     const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/;
//     if (!emailRegex.test(email)) {
//       return res.status(400).json({ error: "Invalid email format" });
//     }

//     // Check if username is at least 3 characters long
//     if (username.length < 5) {
//       return res
//         .status(400)
//         .json({ error: "Username must be at least 5 characters long" });
//     }

//     // Check if password is at least 6 characters long
//     if (password.length < 8) {
//       return res
//         .status(400)
//         .json({ error: "Password must be at least 8 characters long" });
//     }
//     // If there's no error, execute the "next" middleware
//     next();
//   }
// }

// export default Validate;
