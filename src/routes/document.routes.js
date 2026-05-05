import { Router } from "express";
import multer from "multer";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { uploadDocument, getDocuments } from "../controllers/document.controller.js";

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      return cb(null, true);
    }
    cb(new Error("Only PDF files are allowed"));
  },
});

router.get("/", authMiddleware, getDocuments);
router.post("/", authMiddleware, upload.single("file"), uploadDocument);

export const documentRouter = router;
