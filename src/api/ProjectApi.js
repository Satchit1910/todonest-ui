import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const getProjectsByUser = async (userId) => {
    try {
        const response = await axios.get(`${BASE_URL}/project/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching projects:', error);
        throw error; 
    }
};

const createProject = async (projectData) => {
    try {
      const response = await axios.post(`${BASE_URL}/project/create`, projectData);
      return response.data;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  };

const getProjectById = async (projectId) => {
    try {
        const response = await axios.get(`${BASE_URL}/project/get/${projectId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching projects:', error);
        throw error; 
    }
};

const updateProject = async (projectData) => {
    try {
        const response = await axios.put(`${BASE_URL}/project/update`, projectData);
        return response.data;
      } catch (error) {
        console.error('Error updating project:', error);
        throw error;
      }
}

export { getProjectsByUser, createProject, getProjectById, updateProject};
