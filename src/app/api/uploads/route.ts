import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export default async function handler(req, res) {
  const { filename } = req.query;
  const filePath = path.join(process.cwd(), "uploads", filename);

  if (fs.existsSync(filePath)) {
    const fileStream = fs.createReadStream(filePath);
    res.setHeader("Content-Type", "image/jpeg"); // Adjust based on image type
    return fileStream.pipe(res);
  } else {
    return res.status(404).json({ error: "Image not found" });
  }
}