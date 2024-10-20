import { Request, response, Response } from "express";
import Prisma from "../db/db";
import { medicine_type } from "@prisma/client";

type TransactionDetails = {
    medicines_id: number;
    quantity: number;
};

const createTransaction = async (req: Request, res: Response) => {
    try {
        const cashier_name: string = req.body.cashier_name;
        const order_date: Date = new Date(req.body.order_date);
        const transaction_detail: TransactionDetails[] = req.body.transaction_detail;
        // Extract medicine IDs and filter out undefined values
        const arrMedicineId = transaction_detail.map(item => item.medicines_id).filter(Boolean);

        // Await the result of findMany
        const foundMedicines = await Prisma.medicine.findMany({
            where: { id: { in: arrMedicineId } }
        });

        // Create a new transaction
        const saveNewTransaction = await Prisma.transaction.create({
            data: {
                cashier_name,
                order_date
            }
        });

        // Prepare transaction details
        const newDetail: any = transaction_detail.map(async ({ medicines_id, quantity }) => {
            const medicineItem = foundMedicines.find(item => item.id === medicines_id);
            await Prisma.transaction_detail.createMany({
                data: {
                    medicines_id: Number(medicines_id),
                    qty: Number(quantity),
                    transactions_id: saveNewTransaction.id,
                    order_price: medicineItem?.price || 0,
                }
            })
        });

        await Promise.all(newDetail)

        const data = await Prisma.transaction.findFirst({ where: { id: saveNewTransaction.id }, include: { transaction_details: { include: { medicines: { select: { name: true, type: true, price: true } } } } } })

        if (!data) return res.status(404).json({ message: "Data not found" })

        let totalKeseluruhan = data.transaction_details.reduce((sum, detail) => {
            return sum + (detail.order_price * detail.qty);
        }, 0)

        const response = {
            id: saveNewTransaction.id,
            cashier_name,
            order_date,
            transaction_details: data.transaction_details.map(detail => ({
                medicine_name: detail.medicines.name,
                medicine_type: detail.medicines.type,
                medicine_price: detail.medicines.price,
                total: detail.qty * detail.medicines.price
            })),
            totalKeseluruhan
        }

        return res.status(201).json({ message: "Transaction created successfully", response });
    } catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
};

let readTransaction = async (req: Request, res: Response) => {
    try {
        let allTransaction = await Prisma.transaction.findMany({ orderBy: { order_date: "asc" }, include: { transaction_details: { include: { medicines: true } } } })

       const response = allTransaction.map(data => ({
        cashier_name: data.cashier_name,
        order_date: data.order_date,
        transaction: data.transaction_details.map(detail => ({
            medicine_name: detail.medicines.name,
            medicine_type: detail.medicines.type,
            medicine_price: detail.medicines.price,
            total: detail.qty * detail.medicines.price
        }))
       }))
       
       await Promise.all(response)

        return res.status(200).json({ message: "Succes get transaction", allTransaction });
    } catch (error) {
        return res.status(400).json(error)
    }
}

const deleteTransaction = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id)

        const findTransaction = await Prisma.transaction.findFirst({ where: { id } })

        if (!findTransaction) return res.status(404).json({ message: "Transaction not found" })

        await Prisma.transaction_detail.deleteMany({ where: { transactions_id: id } })
       const data = await Prisma.transaction.delete({ where: { id } })

        return res.status(200).json({ message: "Transaction deleted successfully", data })

    } catch (error) {
        return res.status(400).json(error)
    }
}

const updateTransaction = async (req: Request, res: Response) => {
    try {
        //read id transaction from req.params
        const id = Number(req.params.id)

        //check that transaction exist

        const findTransaction = await Prisma
            .transaction
            .findFirst({
                where: { id: Number(id) },
                include: { transaction_details: true }
            })

        //note if transaction not found
        if (!findTransaction) {
            return res.status(400).json({
                message: `Transaction is not found`
            })
        }

        //read a request data
        const cashier_name: string = req.body.cashier_name || findTransaction.cashier_name
        const order_date: Date = new Date(req.body.order_date || findTransaction.order_date)
        const transaction_detail: TransactionDetails[] = req.body.transaction_detail || findTransaction.transaction_details

        //empty detail transaction based on transaction id 
        await Prisma.transaction_detail.deleteMany({
            where: { transactions_id: Number(id) }
        })

        //checking medicine 
        const arrMedicineId = transaction_detail.map(item => item.medicines_id)

        //check medicine if at medicine table
        const findMedicine = await Prisma.medicine.findMany({
            where: {
                id: {
                    in: arrMedicineId
                }
            }
        })

        // check id obat yang tidak tersedia
        const notFoundMedicine = arrMedicineId
            .filter(item => !findMedicine
                .map(obat => obat.id)
                .includes(item))

        if (notFoundMedicine.length > 0) {
            return res.status(200).json({ message: `there are medicine that not exist` })
        }

        //save transaction data
        const saveTransaction = await Prisma.transaction.update({
            where: {
                id: Number(id)
            },
            data: {
                cashier_name,
                order_date
            }
        })

        // Prepare data for transaction detail
        let newDetail: any[] = [];
        for (let index = 0; index < transaction_detail.length; index++) {
            const { medicines_id, quantity } = transaction_detail[index];

            // Find price at each medicine 
            const medicineItems = findMedicine.find(item => item.id === medicines_id);

            // Push data to array with the correct field name
            newDetail.push({
                transactions_id: saveTransaction.id, // Perhatikan penamaan ini
                medicines_id,
                qty: quantity, // Pastikan menggunakan qty sesuai dengan skema
                order_price: medicineItems?.price || 0
            });
        }

        // Save transaction detail
        await Prisma.transaction_detail.createMany({
            data: newDetail
        });


        const data = await Prisma.transaction.findFirst({ where: { id }, include: { transaction_details: { include: { medicines: { select: { name: true } } } } } })

        return res.status(200).json({
            message: `new transaction has been updated`,
            data
        })

    } catch (error) {
        return res.status(500).json(error)
    }
}

const filtersTransaction = async (req: Request, res: Response) => {
    try {
     const {start, end} = req.query 

     const startDate = new Date(start as string)
     const endDate = new Date(end as string)

      const data = await Prisma.transaction.findMany({where: {
                order_date: {
                    gte: startDate,
                    lte: endDate
                }
      }})
      
    } catch (error) {
        return res.status(500).json(error)
    }
}

export { createTransaction, deleteTransaction, readTransaction, updateTransaction, filtersTransaction };
