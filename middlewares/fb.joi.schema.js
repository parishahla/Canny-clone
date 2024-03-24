import Joi from "joi";

const feedbackValidationSchema = Joi.object({
  title: Joi.string().min(10).max(50).required(),
  desc: Joi.string().min(10).required(),
  photo: Joi.string(),
});

export default feedbackValidationSchema;
