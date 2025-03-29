import path from "path";
import { NextResponse } from "next/server";
import heroIMagesModal from "../../../app/models/heroIMagesModal";
import { connection } from "../../../app/utils/db";
import fs from "fs/promises"; // Use `fs/promises` for async file writing

export async function POST(request) {
  try {
    // Connect to MongoDB
    await connection();

    // Get the formData from the request
    const formData = await request.formData();

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true }); // Ensure the directory exists

    // Process each image individually
    const heroImagePaths = {};

    for (let i = 1; i <= 10; i++) {
      const image = formData.get(`image${i}`);
      if (image) {
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filename = `${Date.now()}-${image.name.replace(
          /[^a-zA-Z0-9.-]/g,
          ""
        )}`;
        const imagePath = path.join(uploadsDir, filename);
        await fs.writeFile(imagePath, buffer); // Write file asynchronously

        // Store the image path
        heroImagePaths[`image${i}`] = `/uploads/${filename}`;
      }
    }

    // Find the existing hero images document
    let existingHeroImages = await heroIMagesModal.findOne();

    if (existingHeroImages) {
      // Update the existing document
      Object.assign(existingHeroImages, heroImagePaths);
      await existingHeroImages.save();
      return NextResponse.json(
        {
          message: "Hero images updated successfully",
          heroImages: existingHeroImages,
        },
        { status: 200 }
      );
    } else {
      // Create a new document
      const newHeroImages = await heroIMagesModal.create(heroImagePaths);
      return NextResponse.json(
        {
          message: "Hero images uploaded successfully",
          heroImages: newHeroImages,
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Error uploading hero images:", error);
    return NextResponse.json(
      { error: "Error uploading hero images", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    // Connect to MongoDB
    await connection();

    // Find the existing hero images document
    const existingHeroImages = await heroIMagesModal.findOne();

    if (existingHeroImages) {
      const images = [
        existingHeroImages.image1,
        existingHeroImages.image2,
        existingHeroImages.image3,
      ];

      console.log(images, "images");
      return NextResponse.json({ heroImages: images }, { status: 200 });
    } else {
      return NextResponse.json(
        { error: "Hero images not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error fetching hero images:", error);
    return NextResponse.json(
      { error: "Error fetching hero images", details: error.message },
      { status: 500 }
    );
  }
}
