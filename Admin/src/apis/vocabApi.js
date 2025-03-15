import axiosClient from './axiosClient';

const vocabApi = {
    // Tạo từ vựng mới
    createVocabulary(data) {
        const url = '/vocabulary';
        return axiosClient.post(url, data);
    },

    // Lấy thông tin chi tiết của một từ vựng theo ID
    getDetailVocabulary(id) {
        const url = '/vocabulary/' + id;
        return axiosClient.get(url);
    },

    // Lấy danh sách tất cả các từ vựng với hỗ trợ phân trang
    getListVocabulary(data) {
        const url = '/vocabulary';
        if (!data.page || !data.limit) {
            data.limit = 10;
            data.page = 1;
        }
        return axiosClient.get(url, { params: data });
    },

    // Cập nhật thông tin của từ vựng theo ID
    updateVocabulary(id, data) {
        const url = '/vocabulary/' + id;
        return axiosClient.put(url, data);
    },

    // Xóa một từ vựng theo ID
    deleteVocabulary(id) {
        const url = '/vocabulary/' + id;
        return axiosClient.delete(url);
    },

    // Tìm kiếm từ vựng theo từ khóa
    searchVocabulary(word) {
        const params = {
            word: word.target.value
        }
        const url = '/vocabulary/search';
        return axiosClient.get(url, { params });
    }
}

export default vocabApi;
