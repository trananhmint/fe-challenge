import axios from "axios";
const API_URL = "https://64af72bbc85640541d4e638b.mockapi.io/table-user/user";
export const getUsersAPI = async () => {
  try {
    const response = await axios.get(
      "https://64af72bbc85640541d4e638b.mockapi.io/table-user/user"
    );
    console.log(response);
    if (response.status === 200) {
        return response.data;
    } else {
        return false;
    }
    
  } catch (error: any) {
    console.error("Error fetching users:", error);
  }
};
export const createAUserAPI = async (user: any) => {
  try {
    const response = await axios.post(
      `${API_URL}`, {
        user
      }
    );
    console.log(response);
    if (response.status === 200) {
        return response.data;
    } else {
        return false;
    }
    
  } catch (error: any) {
    console.error("Error fetching create a user:", error);
  }
};
export const getAUserAPI = async (id: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/${Number(id)}`
    );
    console.log(response);
    if (response.status === 200) {
        return response.data;
    } else {
        return false;
    }
    
  } catch (error: any) {
    console.error("Error fetching get a user:", error);
  }
};
export const updateAUserAPI = async (id: string, user?: any) => {
  try {
    const response = await axios.put(
      `${API_URL}/${Number(id)}`, user);
    console.log(response);
    if (response.status === 200) {
        return response.data;
    } else {
        return false;
    }
    
  } catch (error: any) {
    console.error("Error fetching update a user:", error);
  }
};
export const deleteAUserAPI = async (id: string) => {
  console.log(id, "id delete");
  
  try {
    const response = await axios.delete(
      `${API_URL}/${Number(id)}`
    );
    console.log(response);
    if (response.status === 200) {
        return response.data;
    } else {
        return false;
    }
    
  } catch (error: any) {
    console.error("Error fetching remove a user:", error);
  }
};
