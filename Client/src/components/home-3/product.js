import React, { useEffect, useState } from 'react';
import { Box, Image, Text, Flex, Container, Progress, Link, Heading } from '@chakra-ui/react';
import Slider from 'react-slick';
import categoryApi from '../../apis/categoryApi';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useNavigate } from 'react-router-dom';

const Product = () => {
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await categoryApi.getListCategory();
                setCategories(data.categories);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu danh mục:', error);
            }
        };

        fetchCategories();
    }, []);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        arrows: true,
    };

    return (
        <Container maxW="7xl" p={5}>
            <Heading as="h1" size="xl" mb={6} textAlign="center" color="teal.500">
                Danh Mục Chủ Đề
            </Heading>
            <Slider {...settings}>
                {categories.map((category) => (
                    <Box
                        key={category.id}
                        p={5}
                        bg="white"
                        boxShadow="lg"
                        borderRadius="md"
                        height="350px"
                        display="flex"
                        flexDirection="column"
                        justifyContent="space-between"
                        onClick={() => navigate(`/learning/${category.id}`)}
                        cursor="pointer"
                        transition="transform 0.2s"
                        _hover={{ transform: 'scale(1.05)' }}
                    >
                        <Image
                            src={category.image}
                            alt={category.name}
                            objectFit="cover"
                            height="150px"
                            width="100%"
                            borderRadius="md"
                        />
                        <Text mt={2} fontWeight="bold" height="50px">{category.name}</Text>
                        <Text noOfLines={2}>{category.description}</Text>
                    </Box>
                ))}
            </Slider>
        </Container>
    );
};

export default Product;
