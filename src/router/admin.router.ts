import Router from "express";
import {
  readAdmin,
  deleteData,
  createAdmin,
  updateAdmin,
  getAllAdmin,
  authentication,
} from "../controller/admin.controller";
import {
  updateAdminValidation,
  deleteAdminValidation,
  addAdminValidation,
  searchAdminValidate,
  authAdminValidation,
} from "../middleware/admin.validate";
import { verifyToken } from "../middleware/authorization";
const router = Router();

router.get("/searchAdmin", [verifyToken,searchAdminValidate], readAdmin);
router.post("/", [verifyToken,addAdminValidation], createAdmin);
router.get("/",verifyToken, getAllAdmin);
router.put("/:id", [verifyToken,updateAdminValidation], updateAdmin);
router.delete("/:id", [verifyToken,deleteAdminValidation], deleteData);
router.post("/auth",[authAdminValidation], authentication)

export default router;
