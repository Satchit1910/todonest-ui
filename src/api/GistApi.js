import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const createGist = async (projectData) => {
    try {
      const response = await axios.post(`${BASE_URL}/gist/`, projectData);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  };

  const getMarkdownContent = async (projectId) => {
    try {
        const response = await axios.get(`${BASE_URL}/gist/markdown/${projectId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching markdown content:', error);
        throw error; 
    }
};

export { createGist, getMarkdownContent} ;