import api from '../config/api';

const farmService = {
  getAll: async () => {
    const response = await api.get('/farms');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/farms/${id}`);
    return response.data;
  },
  
  create: async (data) => {
    const response = await api.post('/farms', data);
    return response.data;
  },
  
  update: async (id, data) => {
    const response = await api.put(`/farms/${id}`, data);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/farms/${id}`);
    return response.data;
  }
};

export default farmService;