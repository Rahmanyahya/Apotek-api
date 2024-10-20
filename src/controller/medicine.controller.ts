import Prisma from "../db/db";
import {medicine_type} from "@prisma/client"
import e, { Request, Response } from "express"; 
import path from "path"
import fs from "fs"
import { root_dir } from "../config";


const addMedicine = async (req: Request, res: Response) => {
    try {

       const name: string = req.body.name
       const stock: number = Number(req.body.stock);
       const exp_date: Date = new Date(req.body.exp_date);
       const price: number = Number(req.body.price);
       const type: medicine_type  = req.body.type;
       const photo: string = req.file?.filename || ``

       const isMadicineExist = Prisma.medicine.findFirst({where: {name}})

       if (!isMadicineExist) return res.status(400).json({message: "Medicine is exist"})

        const newMadecine = await Prisma.medicine.create({data: {
            name: name,
            stock: stock,
            exp_date: exp_date,
            type: type,
            price: price,
            photo: photo
        }})
        
        return res.status(200).json({message: "succes add medicine", newMadecine})
        
    } catch (error) {
        return res.status(500).json(error)
    }
}

const readMadicine = async (
    req: Request,
    res: Response
) => {
    try {
       const search = req.query.search
       const allMedicine = await Prisma.medicine.findMany({
        where: {
            OR: [
                {name: {contains: search?.toString() || ""}},                                     
           ]
         }
       })
       return res.status(200).json({
       message: `medicine has been retri`,
       data: allMedicine
       })
    } catch (error){
        res.status(500).json(error)
    }
}

const updateMadicine = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        
        const validateId = await Prisma.medicine.findFirst({
            where: { id: Number(id) }
        });

        if (!validateId) return res.status(404).json({ message: "Data not found" });

        if (req.file) {
            let oldFileName = validateId.photo;
            let pathFile = `${root_dir}/public/madicine_photo/${oldFileName}`;
            let existFile = fs.existsSync(pathFile);

            if (existFile && oldFileName !== ``) fs.unlinkSync(pathFile);
            
        }
        
        const { name, price, stock, type, exp_date } = req.body;


        const updateDataMadicine = await Prisma.medicine.update({
            where: {
                id: Number(id),
            },
            data: {
                name: name ? String(name) : String(validateId.name),
                price: price ? Number(price) : Number(validateId.price),
                stock: stock ? Number(stock) : Number(validateId.stock),
                type: type ? type : validateId.type,
                exp_date: exp_date ? exp_date : validateId.exp_date,
                photo: req.file ? req.file.filename : validateId.photo,
            },
        });

        

        return res.status(200).json({ message: "Data has been updated", updateDataMadicine });

    } catch (error) {
        return res.status(500).json({error});
    }
};


const deleteMedicine = async (req: Request, res: Response) => {
    try{
        const id = req.params.id

        /** check existing medicine */
        const findMedicine = await Prisma.medicine.findFirst
        ({where: {
            id: Number(id)
        }})

        if(!findMedicine) {
            return res.status(200)
            .json({message: `medicine is not found`})
        } 

        /** delete medicine  */
        const data = await Prisma.medicine.delete({
            where: {id: Number(id)}
        })

        let oldFileName = findMedicine.photo
        let pathFile = `${root_dir}/public/madicine_photo/${oldFileName}`
        let existFile = fs.existsSync(pathFile)

        if(existFile && oldFileName != ``) fs.unlinkSync(pathFile)

        return res.status(200).json ({
            message: `medicine has been removed`,
            data: data
        })
    }catch(error){
        return res.status(500).json(error)
    }
}

const searchMedicine = async (req: Request, res: Response) => {
    try {
        const name = req.query.name as {name: string}

        const medicines = await Prisma.medicine.findMany({
            where: {
               OR: [
                { name: { contains: name?.toString() || "" } }
               ]
            },
        })

        return res.status(200).json({
            data: medicines,
        })
    } catch (error) {
        return res.status(500).json(error)
    }
}

export {updateMadicine,readMadicine,addMedicine, deleteMedicine, searchMedicine}