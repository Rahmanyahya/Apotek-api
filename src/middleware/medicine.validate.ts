import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import path from "path"
import fs from "fs"
import { root_dir } from "../config";
import crypto from "crypto"

const addSchema = Joi.object({
    name: Joi.string().required(),
    stock: Joi.number().min(1).required(),
    price: Joi.number().min(1).required(),
    type: Joi.string().valid("Syrup", "Tablet", "Powder").required(),
    exp_date: Joi.date().min(Date.now()).required()
})

const validateAddMadicine = (req: Request, res: Response, next: NextFunction) => {
    console.log("tes")
    const validate = addSchema.validate(req.body)

    if (validate.error) { 
        let fileName: string = req.file?.filename || ""
        let pathFile = path.join(root_dir,"public","madicine_photo", fileName)
        let fileExist = fs.existsSync(pathFile)
        if (fileExist && fileName != "") {
            fs.unlinkSync(pathFile)
            return res.status(400).json({message: validate.error.details.map(item => item.message).join()})
        }
       
     }

        return next()
}

const updateSchema = Joi.object({
    name: Joi.string().optional(),
    stock: Joi.number().min(1).optional(),
    price: Joi.number().min(1).optional(),
    type: Joi.string().valid("Syrup", "Tablet", "Powder").optional(),
    exp_date: Joi.date()
})


const updateScheme = Joi.object({
    name: Joi.string().optional(),
    stock: Joi.number().min(0).optional(),
    exp_date: Joi.date().optional(),
    price: Joi.number().min(1).optional(),
    type: Joi.string().valid("Syrup", "tablet", "powder").optional()
})

const updateValidation = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const validate = updateScheme.validate(req.body)
    if (validate.error) {
        let fileName: string = req.file?.filename || ""
        let pathFile = path.join(root_dir,"public","madicine_photo", fileName)
        let fileExist = fs.existsSync(pathFile)
        if (fileExist && fileName !== "") return fs.unlinkSync(pathFile)
        return res.status(400).json({
            message: validate
            .error
            .details
            .map(item => item.message).join()
        })
    }

    return next()
}

const deleteScheme = Joi.object({
    name: Joi.string().optional(),
    stock: Joi.number().min(0).optional(),
    exp_date: Joi.date().optional(),
    price: Joi.number().min(1).optional(),
    type: Joi.string().valid("Syrup", "tablet", "powder").optional()
})

const deleteValidation = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const validate = deleteScheme.validate(req.body)
    if (validate.error) {
        return res.status(400).json({
            message: validate
            .error
            .details
            .map(item => item.message).join()
        })
    }

    return next()
}

const searchMedicineSchema = Joi.object({
    name: Joi.string().required(),
  });
  
  const searchMedicineValidate = (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const validate = searchMedicineSchema.validate(req.query);
    if (validate.error)
      return res
        .status(400)
        .json({ message: validate.error.details.map((item) => item.message) });
    return next();
  };

export { validateAddMadicine, updateValidation,deleteValidation, searchMedicineValidate}