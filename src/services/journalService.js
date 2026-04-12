import api from '../config/api';

const journalService = {
  getByZone: async (zoneId, limit) => {
    const response = await api.get(`/journals/zone/${zoneId}`, { params: { limit } });
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/journals/${id}`);
    return response.data;
  },
  
  create: async (data) => {
    const response = await api.post('/journals', data);
    return response.data;
  },
  
  update: async (id, data) => {
    const response = await api.put(`/journals/${id}`, data);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/journals/${id}`);
    return response.data;
  },
  
  getStats: async (zoneId) => {
    const response = await api.get(`/journals/zone/${zoneId}/stats`);
    return response.data;
  }
};

export default journalService;