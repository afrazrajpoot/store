import Product from "@/app/models/productModal";

export async function PATCH(request) {
    try {
      // Connect to MongoDB
      await connection();
  
      // Parse the request body and query params
      const { searchParams } = new URL(request.url);
      const productId = searchParams.get('id'); // Product ID from the query
  
      if (!productId) {
        return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
      }
  
      const formData = await request.formData();
  
      // Parse and update data
      const updatedData = {
        name: formData.get('name'),
        price: Number(formData.get('price')),
        label: formData.get('label'),
        description: formData.get('description'),
        category: formData.get('category'),
        colors: JSON.parse(formData.get('colors') || '[]'),
        sizes: JSON.parse(formData.get('sizes') || '[]'),
        material: formData.get('material'),
        features: JSON.parse(formData.get('features') || '[]'),
        care: formData.get('care'),
        rating: formData.get('rating') ? Number(formData.get('rating')) : undefined,
        reviews: formData.get('reviews') ? Number(formData.get('reviews')) : undefined,
        stock: JSON.parse(formData.get('stock') || '[]'),
        specifications: JSON.parse(formData.get('specifications') || '{}'),
        discountPrice: Number(formData.get('discountPrice')),
        tags: JSON.parse(formData.get('tags') || '[]')
      };
  
      // Remove undefined values to avoid overwriting existing fields with undefined
      Object.keys(updatedData).forEach(key => updatedData[key] === undefined && delete updatedData[key]);
  
      // Update product in the database
      const product = await Product.findByIdAndUpdate(productId, updatedData, { new: true });
      if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
  
      return NextResponse.json({ message: 'Product updated successfully', product }, { status: 200 });
    } catch (error) {
      console.error('Error updating product:', error);
      return NextResponse.json(
        { error: 'Error updating product', details: error.message },
        { status: 500 }
      );
    }
  }
  