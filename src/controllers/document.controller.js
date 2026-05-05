import { Document } from "../models/document.model.js";

export const uploadDocument = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Document title is required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "PDF file is required" });
    }

    const document = await Document.create({
      title: title.trim(),
      originalName: req.file.originalname,
      filename: req.file.filename,
      mimeType: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      uploader: req.user.id,
    });

    res.status(201).json(document);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to upload document" });
  }
};

export const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ uploader: req.user.id }).sort({ createdAt: -1 });
    res.json(documents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load documents" });
  }
};
