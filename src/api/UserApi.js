import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const getUserByEmail = async (email) => { 
  try {
    const response = await axios.get(`${BASE_URL}/user/get/${email}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    console.log(error.response.data);
    if(error.response.data === 'User not found') {
        toast.error("Account with this Email does not exist. Please create a New Account!")
    }
    throw error; 
  }
};

const createUser = async (userData) => {
    try {
      const response = await axios.post(`${BASE_URL}/user/create`, userData);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  };

export { getUserByEmail, createUser};