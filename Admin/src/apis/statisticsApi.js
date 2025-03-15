import axiosClient from './axiosClient';

const statisticsApi = {
  async getAllStatistics() {
    try {
      const response = await axiosClient.get('/stats/');
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default statisticsApi;
