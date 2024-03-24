import Joi from "joi";

const userValidationSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  photo: Joi.string(),
  password: Joi.string().min(8).required(),
});

export default userValidationSchema;