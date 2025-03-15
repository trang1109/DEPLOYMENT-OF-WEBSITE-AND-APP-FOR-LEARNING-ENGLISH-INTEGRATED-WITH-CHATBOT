'use client'

import {
    Avatar,
    Box,
    Button,
    Container,
    Flex,
    Heading,
    Stack,
    Text,
    useColorModeValue
} from '@chakra-ui/react';
import React from 'react';
import HomeSection1 from '../components/home-1/homeSection1';
import PromotionalSection from '../components/home-2/PromotionalSection';
import HomeSection3 from '../components/home-3/product';
import Home4 from '../components/home-4/home4';
import News from '../components/home-5/home5';


const Testimonial = ({ children }) => {
    return <Box>{children}</Box>;
};

const TestimonialContent = ({ children }) => {
    return (
        <Stack
            bg={useColorModeValue('white', 'gray.800')}
            boxShadow={'lg'}
            p={8}
            rounded={'xl'}
            align={'center'}
            pos={'relative'}
            _after={{
                content: `""`,
                w: 0,
                h: 0,
                borderLeft: 'solid transparent',
                borderLeftWidth: 16,
                borderRight: 'solid transparent',
                borderRightWidth: 16,
                borderTop: 'solid',
                borderTopWidth: 16,
                borderTopColor: useColorModeValue('white', 'gray.800'),
                pos: 'absolute',
                bottom: '-16px',
                left: '50%',
                transform: 'translateX(-50%)',
            }}>
            {children}
        </Stack>
    );
};

const TestimonialHeading = ({ children }) => {
    return (
        <Heading as={'h3'} fontSize={'xl'}>
            {children}
        </Heading>
    );
};

const TestimonialText = ({ children }) => {
    return (
        <Text
            textAlign={'center'}
            color={useColorModeValue('gray.600', 'gray.400')}
            fontSize={'sm'}>
            {children}
        </Text>
    );
};

const TestimonialAvatar = ({ src, name, title }) => {
    return (
        <Flex align={'center'} mt={8} direction={'column'}>
            <Avatar src={src} mb={2} />
            <Stack spacing={-1} align={'center'}>
                <Text fontWeight={600}>{name}</Text>
                <Text fontSize={'sm'} color={useColorModeValue('gray.600', 'gray.400')}>
                    {title}
                </Text>
            </Stack>
        </Flex>
    );
};

const Home = () => {
    return (
        <Box bg={useColorModeValue('gray.100', 'gray.700')}>

            <HomeSection1 />
            <Container maxW="7xl" >
                <Box bg="blue.100" p={4} borderRadius="md" mb={2}>
                    <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                        HỌC TIẾNG ANH
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                        Bắt đầu ngay hôm nay và cải thiện kỹ năng của bạn!
                    </Text>
                </Box>
            </Container>
            <HomeSection3 />

            <News/>

            <Container maxW={'7xl'} py={16} as={Stack} spacing={12}>
                <Stack spacing={0} align={'center'}>
                    <Heading>Phản Hồi Từ Học Viên</Heading>
                    <Text>Chúng tôi đã nhận được nhiều phản hồi tích cực từ học viên về dịch vụ học tiếng Anh của chúng tôi.</Text>
                </Stack>
                <Stack
                    direction={{ base: 'column', md: 'row' }}
                    spacing={{ base: 10, md: 4, lg: 10 }}>
                    <Testimonial>
                        <TestimonialContent>
                            <TestimonialHeading>Trải nghiệm học tập tuyệt vời</TestimonialHeading>
                            <TestimonialText>
                                Các khóa học tiếng Anh rất toàn diện và dễ theo dõi. Tôi đã cải thiện kỹ năng của mình đáng kể.
                            </TestimonialText>
                        </TestimonialContent>
                        <TestimonialAvatar
                            src={
                                'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
                            }
                            name={'Nguyễn Văn A'}
                            title={'Học viên'}
                        />
                    </Testimonial>
                    <Testimonial>
                        <TestimonialContent>
                            <TestimonialHeading>Giao diện thân thiện</TestimonialHeading>
                            <TestimonialText>
                                Nền tảng rất thân thiện với người dùng, giúp tôi dễ dàng điều hướng qua các khóa học và theo dõi tiến trình của mình.
                            </TestimonialText>
                        </TestimonialContent>
                        <TestimonialAvatar
                            src={
                                'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
                            }
                            name={'Trần Thị B'}
                            title={'Học viên'}
                        />
                    </Testimonial>
                    <Testimonial>
                        <TestimonialContent>
                            <TestimonialHeading>Hỗ trợ xuất sắc</TestimonialHeading>
                            <TestimonialText>
                                Dịch vụ hỗ trợ khách hàng rất xuất sắc, luôn sẵn sàng giúp đỡ với bất kỳ câu hỏi nào tôi có về các khóa học.
                            </TestimonialText>
                        </TestimonialContent>
                        <TestimonialAvatar
                            src={
                                'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
                            }
                            name={'Lê Văn C'}
                            title={'Học viên'}
                        />
                    </Testimonial>
                </Stack>
            </Container>

            <Home4/>

        </Box>
    );
};

export default Home;