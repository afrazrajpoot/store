import path from "path";
import { NextResponse } from "next/server";
import fs from "fs";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const filename = url.searchParams.get("filename");

    if (!filename) {
      return NextResponse.json(
        { error: "Filename is required" },
        { status: 400 }
      );
    }

    const filePath = path.join(process.cwd(), "uploads", filename);
    console.log(filePath, "file path");
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    return new NextResponse(fs.readFileSync(filePath), {
      headers: { "Content-Type": "image/jpeg" },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error retrieving image" },
      { status: 500 }
    );
  }
}
