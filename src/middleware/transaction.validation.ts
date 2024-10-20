import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { start } from "repl";

const detailSchema = Joi.object({
    medicines_id: Joi.number().required(),
    quantity: Joi.number().min(1).required(),
})

const createSchema = Joi.object({
    cashier_name: Joi.string().required(),
    order_date: Joi.date().required(),
    transaction_detail: Joi.array().items(detailSchema).min(1).required(),
})

const addTransactionValidation = (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const validate = createSchema.validate(req.body);
    if (validate.error)
      return res
        .status(400)
        .json({ message: validate.error.details.map((item) => item.message) });
    return next();
  };

  const updateDetailSchema = Joi.object({
    medicines_id: Joi.number().optional(),
    quantity: Joi.number().min(1).optional(),
})

const updateSchema = Joi.object({
    cashier_name: Joi.string().optional(),
    order_date: Joi.date().optional(),
    transaction_detail: Joi.array().items(detailSchema).min(1).optional(),
})

const updateTransactionValidation = (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const validate = createSchema.validate(req.body);
    if (validate.error)
      return res
        .status(400)
        .json({ message: validate.error.details.map((item) => item.message) });
    return next();
  };


 const deleteSchema = Joi.object({
   id: Joi.number().positive().required(),
 })

 const validateDeleteTransaction = async (req: Request, res: Response, next: NextFunction) => {
   const validate = deleteSchema.validate(req.params);
   if (validate.error)
     return res
       .status(400)
       .json({ message: validate.error.details.map((item) => item.message) });
   return next();
 }

 const filterSchema = Joi.object({
  start: Joi.date().required(),
  end: Joi.date().required()
 })

 const validationFilter = (req: Request, res: Response, next: NextFunction) => {
    const validate = filterSchema.validate(req.query);
    if (validate.error)
      return res
       .status(400)
       .json({ message: validate.error.details.map((item) => item.message) });
    return next();
 }


export {addTransactionValidation, updateTransactionValidation, validateDeleteTransaction, validationFilter}