import { Router } from "express";
import {createTransaction, deleteTransaction, filtersTransaction, readTransaction, updateTransaction} from "../controller/transaction.controller"
import { addTransactionValidation, updateTransactionValidation, validateDeleteTransaction, validationFilter } from "../middleware/transaction.validation";
import { verifyToken } from "../middleware/authorization";

const router = Router();
router.post("/", [verifyToken,addTransactionValidation] ,createTransaction)
router.get("/", verifyToken,readTransaction)
router.delete('/:id', [verifyToken,validateDeleteTransaction], deleteTransaction)
router.put("/:id", [verifyToken,updateTransactionValidation], updateTransaction)
router.get("/filters", [verifyToken,validationFilter], filtersTransaction)

export default router;