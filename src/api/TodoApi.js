import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const createTodo = async (todoData) => {
    try {
      const response = await axios.post(`${BASE_URL}/todo/create`, todoData);
      return response.data;
    } catch (error) {
      console.error('Error creating todo:', error);
      throw error;
    }
  };

  const updateTodo = async (todoData) => {
    try {
      const response = await axios.put(`${BASE_URL}/todo/update`, todoData);
      return response.data;
    } catch (error) {
      console.error('Error updating todo:', error);
      throw error;
    }
  };

  const deleteTodoById = async (todoId) => {
    try {
        const response = await axios.delete(`${BASE_URL}/todo/delete/${todoId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting todo:', error);
        throw error; 
    }
};

export { createTodo, updateTodo, deleteTodoById };