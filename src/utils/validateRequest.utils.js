import { validationResult } from "express-validator";

export const validateRequest = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg).join(" | ");
    res.status(400).json({
      ok: false,
      status: 400,
      message: errorMessages,
    });
    return false;
  }
  return true;
};
