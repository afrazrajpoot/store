import { NextResponse } from "next/server";
import Product from "@/app/models/productModal";
import path from "path";
import { connection } from "@/app/utils/db";
import { promises as fs } from "fs";

export async function POST(request) {
  try {
    // Connect to MongoDB
    await connection();

    // Get the formData from the request
    const formData = await request.formData();

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), "public");
    try {
      await fs.mkdir(uploadsDir, { recursive: true });
    } catch (err) {
      if (err.code !== "EEXIST") throw err;
    }

    // Process main image
    const mainImage = formData.get("image");
    let mainImagePath = "";
    if (mainImage) {
      const bytes = await mainImage.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${mainImage.name.replace(
        /[^a-zA-Z0-9.-]/g,
        ""
      )}`;
      const imagePath = path.join(uploadsDir, filename);
      await fs.writeFile(imagePath, buffer);
      mainImagePath = `/${filename}`;
    }

    // Process hover images
    const hoverImages = formData.getAll("hoverImages");
    const hoverImagePaths = await Promise.all(
      hoverImages.map(async (image) => {
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filename = `${Date.now()}-${image.name.replace(
          /[^a-zA-Z0-9.-]/g,
          ""
        )}`;
        const imagePath = path.join(uploadsDir, filename);
        await fs.writeFile(imagePath, buffer);
        return `/${filename}`;
      })
    );

    // Parse JSON fields with error handling
    const parseJSON = (value, defaultValue = []) => {
      try {
        return value ? JSON.parse(value) : defaultValue;
      } catch (error) {
        console.error(`Error parsing JSON: ${error.message}`);
        return defaultValue;
      }
    };

    // Process other form data
    const productData = {
      name: formData.get("name"),
      price: Number(formData.get("price")),
      image: mainImagePath,
      hoverImages: hoverImagePaths,
      label: formData.get("label"),
      description: formData.get("description"),
      category: formData.get("category"),
      colors: parseJSON(formData.get("colors")),
      sizes: parseJSON(formData.get("sizes")),
      material: formData.get("material"),
      features: parseJSON(formData.get("features")),
      care: formData.get("care"),
      rating: formData.get("rating") ? Number(formData.get("rating")) : 0,
      reviews: formData.get("reviews") ? Number(formData.get("reviews")) : 0,
      stock: parseJSON(formData.get("stock")),
      specifications: parseJSON(formData.get("specifications"), {}),
      discountPrice: Number(formData.get("discountPrice")),
      tags: parseJSON(formData.get("tags")),
    };

    // Create new product
    const product = await Product.create(productData);

    return NextResponse.json(
      {
        message: "Product created successfully",
        product,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating product:", error);

    if (error.name === "ValidationError") {
      return NextResponse.json(
        {
          error: "Validation Error",
          details: Object.values(error.errors).map((err) => err.message),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "Error creating product",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    // Connect to MongoDB
    await connection();

    // Parse the request body and query params
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("id");

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const formData = await request.formData();

    // Fetch existing product
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    // Handle main image update
    const mainImage = formData.get("image");
    let mainImagePath = existingProduct.image;

    if (mainImage) {
      const bytes = await mainImage.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${mainImage.name.replace(
        /[^a-zA-Z0-9.-]/g,
        ""
      )}`;
      const imagePath = path.join(uploadsDir, filename);
      await fs.writeFile(imagePath, buffer);

      // Delete old image if it exists
      if (existingProduct.image) {
        try {
          await fs.unlink(
            path.join(process.cwd(), "public", existingProduct.image)
          );
        } catch (err) {
          console.warn("Old image deletion failed:", err.message);
        }
      }

      mainImagePath = `/uploads/${filename}`;
    }

    // Handle hover images update
    const hoverImages = formData.getAll("hoverImages");
    let hoverImagePaths = existingProduct.hoverImages;

    if (hoverImages.length > 0) {
      hoverImagePaths = await Promise.all(
        hoverImages.map(async (image) => {
          const bytes = await image.arrayBuffer();
          const buffer = Buffer.from(bytes);
          const filename = `${Date.now()}-${image.name.replace(
            /[^a-zA-Z0-9.-]/g,
            ""
          )}`;
          const imagePath = path.join(uploadsDir, filename);
          await fs.writeFile(imagePath, buffer);
          return `/uploads/${filename}`;
        })
      );

      // Delete old hover images if they exist
      if (existingProduct.hoverImages.length > 0) {
        await Promise.all(
          existingProduct.hoverImages.map(async (oldImage) => {
            try {
              await fs.unlink(path.join(process.cwd(), "public", oldImage));
            } catch (err) {
              console.warn("Old hover image deletion failed:", err.message);
            }
          })
        );
      }
    }

    // Updated parseJSON function with better error handling for stock
    const parseJSON = (value, defaultValue = []) => {
      if (!value) return defaultValue;

      try {
        // Handle case where value is already an object/array
        if (typeof value === "object") return value;

        const parsed = JSON.parse(value);
        return parsed;
      } catch (error) {
        console.error(`Error parsing JSON: ${error.message}`);
        return defaultValue;
      }
    };

    // Get stock data from form
    const stockData = formData.get("stock");
    const parsedStock = parseJSON(stockData, []);
    console.log(parsedStock, "stocks");
    // Validate stock data structure
    const validatedStock = Array.isArray(parsedStock) ? parsedStock : [];

    const updatedData = {
      name: formData.get("name"),
      price: Number(formData.get("price")),
      image: mainImagePath,
      hoverImages: hoverImagePaths,
      label: formData.get("label"),
      description: formData.get("description"),
      category: formData.get("category"),
      colors: parseJSON(formData.get("colors")),
      sizes: parseJSON(formData.get("sizes")),
      material: formData.get("material"),
      features: parseJSON(formData.get("features")),
      care: formData.get("care"),
      rating: formData.get("rating")
        ? Number(formData.get("rating"))
        : undefined,
      reviews: formData.get("reviews")
        ? Number(formData.get("reviews"))
        : undefined,
      stock: validatedStock, // Use the validated stock data
      specifications: parseJSON(formData.get("specifications"), {}),
      discountPrice: Number(formData.get("discountPrice")),
      tags: parseJSON(formData.get("tags")),
    };

    Object.keys(updatedData).forEach(
      (key) => updatedData[key] === undefined && delete updatedData[key]
    );

    const product = await Product.findByIdAndUpdate(productId, updatedData, {
      new: true,
    });

    return NextResponse.json(
      { message: "Product updated successfully", product },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Error updating product", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    // Connect to MongoDB
    await connection();

    // Parse the request URL to get query params
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("id"); // Optional: fetch a single product by ID

    if (productId) {
      // Fetch a single product
      const product = await Product.findById(productId);
      if (!product) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(product, { status: 200 });
    }

    // Fetch all products
    const products = await Product.find();
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Error fetching products", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    // Connect to MongoDB
    await connection();

    // Parse the request URL to get the product ID
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("id");

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }
    console.log(productId, "id");
    // Delete the product
    const product = await Product.findByIdAndDelete(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Error deleting product", details: error.message },
      { status: 500 }
    );
  }
}
