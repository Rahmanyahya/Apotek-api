import { Request, Response } from "express";
import Prisma from "../db/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

const createAdmin = async (req: Request, res: Response) => {
  try {
    const { email, name, password } = req.body;

    const isAccountExist = await Prisma.admin.findUnique({ where: { email } });

    if (isAccountExist) throw new Error("Account is exist");

    const addAccount = await Prisma.admin.create({
      data: { email, name, password: await bcrypt.hash(password, 12) },
    });

    return res.status(200).json({ message: "Succes add data", addAccount });
  } catch (error) {
    console.log(error)
  }
};

const readAdmin = async (req: Request, res: Response) => {
  try {
    const search = req.query.search;
    const allMedicine = await Prisma.admin.findMany({
      where: {
        OR: [{ name: { contains: search?.toString() || "" } }],
      },
    });

    return res.status(200).json({
      message: `admin has been retri`,
      data: allMedicine,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const updateAdmin = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { name, email, password } = req.body;

    const isAccountExist = await Prisma.admin.findFirst({ where: { id } });

    if (!isAccountExist)
      return res.status(404).json({ message: "Account not found" });

    const updateData = await Prisma.admin.update({
      where: { id: isAccountExist.id },
      data: {
        name: name ? name : isAccountExist.password,
        email: email ? email : isAccountExist.email,
        password: password
          ? await bcrypt.hash(password, 12)
          : isAccountExist.password,
      },
    });

    return res
      .status(200)
      .json({ message: "Data succes updated", data: updateData });
  } catch (error) {
    return res.status(400).json(error);
  }
};

const deleteData = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const isDataExist = await Prisma.admin.findFirst({ where: { id } });

    if (!isDataExist) return res.status(404).json({message: "Data not found"})

    const deleteData = await Prisma.admin.delete({ where: { id } });
    return res.status(200).json({ message: "Data succes delete", deleteData });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};

const getAllAdmin = async (req: Request, res: Response) => {
  try {
    const data = await Prisma.admin.findMany();
    return res.status(200).json({ message: "Succes get admin", data });
  } catch (error) {
    console.log(error)
    return res.status(400).json(error);
  }
};

const authentication = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const findAdmin = await Prisma.admin.findUnique({ where: { email } })

    if(!findAdmin) throw new Error("Admin is not registed")
    
      bcrypt.compare(password, findAdmin.password, (err,_) => {
      if(err) throw new Error("Password not match")
      const payload = {
          name: findAdmin.name,
          email: findAdmin.email
      }

    return res.status(200).json({
      message: "Succes Login",
      token: jwt.sign(payload, String(process.env.secret))
    })
    })
  } catch (error) {
    return res.status(400).json(error);
  }
};

export { deleteData, readAdmin, createAdmin, updateAdmin, getAllAdmin, authentication };
