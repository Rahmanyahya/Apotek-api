import {
  addMedicine,
  updateMadicine,
  readMadicine,
  deleteMedicine,
  searchMedicine,
} from "../controller/medicine.controller";
import {
  deleteValidation,
  searchMedicineValidate,
  updateValidation,
  validateAddMadicine,
} from "../middleware/medicine.validate";
import { Router } from "express";
import { uploadMedicinePhoto } from "../middleware/upload-photo";
import { deleteAdminValidation, updateAdminValidation } from "../middleware/admin.validate";
import { updateAdmin } from "../controller/admin.controller";
import { verifyToken } from "../middleware/authorization";

const router = Router();

router.post(
  "/",
  [uploadMedicinePhoto.single(`photo`), validateAddMadicine],
  addMedicine,
);
router.put("/:id", [verifyToken,uploadMedicinePhoto.single(`photo`), updateValidation], updateMadicine);
router.get("/", verifyToken,readMadicine);
router.delete("/:id", [verifyToken,deleteAdminValidation], deleteMedicine);
router.get("/search", [verifyToken,searchMedicineValidate],searchMedicine)

export default router;
