// app/products/_layout.js
import { Stack } from "expo-router";

export default function ProductLayout() {
  return (
    <Stack>
      <Stack.Screen name="ProductList" options={{ title: "My Products" }} />
      <Stack.Screen name="AddProduct" options={{ title: "Add Product" }} />
      <Stack.Screen name="EditProduct" options={{ title: "Edit Product" }} />
      <Stack.Screen name="ProductDetails" options={{ title: "Product Details" }} />
    </Stack>
  );
}
