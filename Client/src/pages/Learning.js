import React, { useEffect, useState } from 'react';
import { Box, Text, Spinner, Input, Button, Grid, GridItem, Image } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import categoryApi from '../apis/categoryApi';

const Learning = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [categoriesPerPage] = useState(5);
    const [filters, setFilters] = useState({
        name: '',
    });

    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await categoryApi.getListCategory();
                setCategories(data.categories);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách khóa học:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        });
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleCategoryClick = (categoryId) => {
        navigate(`/learning/${categoryId}`);
    };

    const filteredCategories = categories.filter(category => {
        return (
            (filters.name === '' || category.name.toLowerCase().includes(filters.name.toLowerCase()))
        );
    });

    const indexOfLastCategory = currentPage * categoriesPerPage;
    const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
    const currentCategories = filteredCategories.slice(indexOfFirstCategory, indexOfLastCategory);
    const totalPages = Math.ceil(filteredCategories.length / categoriesPerPage);

    if (loading) {
        return <Spinner />;
    }

    return (
        <Box p={8}>
            <Grid templateColumns="1fr 3fr" gap={6}>
                <GridItem>
                    <Box p={4} borderWidth={1} borderRadius="md" boxShadow="md">
                        <Text fontSize="xl" mb={4}>Bộ lọc</Text>
                        <Input
                            placeholder="Tên khóa học"
                            name="name"
                            value={filters.name}
                            onChange={handleFilterChange}
                            mb={4}
                        />
                    </Box>
                </GridItem>
                <GridItem>
                    <Box>
                        <Text fontSize="2xl" mb={4}>Danh sách khóa học</Text>
                        {currentCategories.map(category => (
                            <Box
                                key={category.id}
                                p={4}
                                borderWidth={1}
                                borderRadius="md"
                                mb={4}
                                display="flex"
                                alignItems="center"
                                boxShadow="md"
                                cursor="pointer"
                                onClick={() => handleCategoryClick(category.id)}
                                _hover={{ bg: 'gray.100' }}
                            >
                                <Image src={category.image} alt={category.name} boxSize="100px" borderRadius="md" mr={4} />
                                <Box>
                                    <Text fontSize="xl" fontWeight="bold">{category.name}</Text>
                                    <Text>Mô tả: {category.description}</Text>
                                </Box>
                            </Box>
                        ))}
                        <Box mt={4} display="flex" justifyContent="space-between">
                            <Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                                Trước
                            </Button>
                            <Text>Trang {currentPage} của {totalPages}</Text>
                            <Button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                                Tiếp theo
                            </Button>
                        </Box>
                    </Box>
                </GridItem>
            </Grid>
        </Box>
    );
};

export default Learning; 