export default function valiateSignup(schema, signin) {
  return (req, res, next) => {
    //* check for valid input
    const { error } = schema.validate(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
    } else {
      return next(signin);
    }
  };
}

//*************************************** */
// This piece of code is supposed to work with api v2.0.0 -
// import User from "../model/user.model.js";

// class Validate {
//   constructor(model) {
//     this.model = model;
//   }

//   findEmail(email) {
//     return this.model.findOne({ email: email });
//   }

//   static validateUserInput(req, res, next) {
//     let { username, email, password } = req.body;

//     if (!username || !email || !password) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/;
//     if (!emailRegex.test(email)) {
//       return res.status(400).json({ error: "Invalid email format" });
//     }

//     if (username.length < 5) {
//       return res
//         .status(400)
//         .json({ error: "Username must be at least 5 characters long" });
//     }

//     if (password.length < 8) {
//       return res
//         .status(400)
//         .json({ error: "Password must be at least 8 characters long" });
//     }

//     next();
//   }
// }

// export default Validate;
