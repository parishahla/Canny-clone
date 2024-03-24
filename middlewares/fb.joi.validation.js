export default function valiatePostFeedback(schema) {
  return (req, res, next) => {
    const payload = req.body;
    //* check for valid input
    const { error } = schema.validate(payload);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
    } else {
      return next();
    }
    next();
  };
}
