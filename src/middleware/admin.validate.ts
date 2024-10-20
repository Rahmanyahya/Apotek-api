import Joi from "joi";
import { Request, Response, NextFunction } from "express";

const addAdminSchema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().required(),
  password: Joi.string().min(8).required(),
});

const addAdminValidation = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const validate = addAdminSchema.validate(req.body);
  if (validate.error)
    return res
      .status(400)
      .json({ message: validate.error.details.map((item) => item.message) });
  return next();
};

const deleteAdminSchema = Joi.object({
  id: Joi.number().required(),
});

const deleteAdminValidation = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const validate = deleteAdminSchema.validate(req.params);
  if (validate.error)
    return res
      .status(400)
      .json({ message: validate.error.details.map((item) => item.message) });
  return next();
};

const updateAdminSchema = Joi.object({
  email: Joi.string().email().optional(),
  name: Joi.string().optional(),
  password: Joi.string().min(8).optional(),
});

const updateAdminValidation = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const validate = updateAdminSchema.validate(req.body);
  if (validate.error)
    return res
      .status(400)
      .json({ message: validate.error.details.map((item) => item.message) });
  return next();
};

const searchAdminSchema = Joi.object({
  search: Joi.string().required(),
});

const searchAdminValidate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const validate = searchAdminSchema.validate(req.query);
  if (validate.error)
    return res
      .status(400)
      .json({ message: validate.error.details.map((item) => item.message) });
  return next();
};

const loginAdminSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
})

const authAdminValidation = (
  req: Request,
  res: Response,
  next: NextFunction,) => {
    const validate = loginAdminSchema.validate(req.body);
    if (validate.error) return res
       .status(400)
       .json({ message: validate.error.details.map((item) => item.message) });
    return next();
  }

export {
  addAdminValidation,
  deleteAdminValidation,
  updateAdminValidation,
  searchAdminValidate,
  authAdminValidation
};
