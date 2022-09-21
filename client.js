import axios from "axios";

export const getProducts = async () => {
  const { data } = await axios.get("http://localhost:8080/api/products");
  return data;
};

export const getOneProduct = async (id) => {
  const { data } = await axios.get(`http://localhost:8080/api/products/${id}`);
  return data;
};

export const postOneProduct = async () => {
  try {
    const { data } = await axios.post("http://localhost:8080/api/products", {
      name: "new product",
      description: "new product description",
      code: "NP",
      thumbnail: "new product thumbnail",
      price: 200,
      stock: 15,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const updateProduct = async (id) => {
  try {
    const { data } = await axios.put(
      `http://localhost:8080/api/products/${id}`,
      {
        name: "new product",
        description: "Modify description of new product",
        code: "NP",
        thumbnail: "new product thumbnail",
        price: 200,
        stock: 15,
      }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteOneProduct = async (id) => {
  try {
    const { data } = await axios.delete(
      `http://localhost:8080/api/products/${id}`
    );
    return data;
  } catch (error) {
    console.log("mensaje de error", error.message);
  }
};
