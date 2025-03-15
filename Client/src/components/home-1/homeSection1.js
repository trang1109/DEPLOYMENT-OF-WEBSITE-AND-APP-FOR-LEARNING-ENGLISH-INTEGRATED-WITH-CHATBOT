import React from 'react';
import { Box, Image, Flex, Container } from '@chakra-ui/react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const HomeSection1 = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        arrows: false,
    };

    return (
        <Container maxW="7xl" p={5}>
            <Flex justify="space-between">
                <Box textAlign="center" width="70%" position="relative" height="440px">
                    <Slider {...settings}>
                        <div>
                            <Image src="https://i0.wp.com/vn.elsaspeak.com/wp-content/uploads/2024/09/thoi-gian-thi-toeic-bao-lau-cach-chia-thoi-gian-lam-bai-tot-nhat-thumb.png?w=1200&ssl=1" alt="Promo 1" borderRadius="md" width="98%" height="400px" objectFit="fill" />
                        </div>
                        <div>
                            <Image src="https://i0.wp.com/vn.elsaspeak.com/wp-content/uploads/2024/09/meo-thi-toeic-4-ky-nang-thumb.png?w=1200&ssl=1" alt="Promo 2" borderRadius="md" width="98%" height="400px" objectFit="fill" />
                        </div>
                        <div>
                            <Image src="https://i0.wp.com/vn.elsaspeak.com/wp-content/uploads/2024/09/tu-vung-toeic-theo-chu-de-moi-nhat-thumb.png?w=1200&ssl=1" alt="Promo 3" borderRadius="md" width="98%" height="400px" objectFit="fill" />
                        </div>
                    </Slider>
                </Box>
                <Flex direction="column" align="center" width="30%" height="385px">
                    <Box textAlign="center" width="100%" position="relative" mb={4} height="50%">
                        <Image src="https://i0.wp.com/vn.elsaspeak.com/wp-content/uploads/2024/11/bang-thang-diem-toeic-moi-nhat-2024-cach-tinh-diem-chi-tiet-thumb.png?w=1200&ssl=1" alt="Promo 2" borderRadius="md" width="100%"  height="100%" />
                    </Box>
                    <Box textAlign="center" width="100%" position="relative" height="50%">
                        <Image src="https://i0.wp.com/vn.elsaspeak.com/wp-content/uploads/2024/10/ielts-toefl-toeic-cai-nao-kho-nhat-nen-hoc-cai-nao-thi-tot-thumb-2.png?w=1200&ssl=1" alt="Promo 3" borderRadius="md" width="100%"  height="100%" />
                    </Box>
                </Flex>
            </Flex>
        </Container>
    );
};

export default HomeSection1;
