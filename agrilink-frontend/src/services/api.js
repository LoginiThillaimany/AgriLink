import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getProducts = async (farmerId) => {
  try {
    const response = await axios.get(`${API_URL}/products`, { params: { farmerId } });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch products');
  }
};

export const addProduct = async (productData) => {
  try {
    const response = await axios.post(`${API_URL}/products`, productData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to add product');
  }
};

export const updateProduct = async (productId, productData) => {
  try {
    const response = await axios.put(`${API_URL}/products/${productId}`, productData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to update product');
  }
};

export const deleteProduct = async (productId) => {
  try {
    await axios.delete(`${API_URL}/products/${productId}`);
    return true;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to delete product');
  }
};