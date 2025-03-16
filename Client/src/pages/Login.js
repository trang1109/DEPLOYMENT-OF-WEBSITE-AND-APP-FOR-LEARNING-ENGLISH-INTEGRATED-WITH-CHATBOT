import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Box,
    Button,
    Checkbox,
    Flex,
    Text,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Stack,
    useToast,
    Image
} from '@chakra-ui/react';
import userApi from '../apis/userApi';

const Login = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();

    const handleLogin = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData(event.target);
            const values = Object.fromEntries(formData.entries());
            await userApi.login(values);
            toast({ title: 'Đăng nhập thành công', status: 'success', duration: 3000, isClosable: true });
            navigate('/home');
        } catch (error) {
            toast({ title: 'Đăng nhập thất bại', description: error.message, status: 'error', duration: 3000, isClosable: true });
        }
        setLoading(false);
    };

    return (
        <Stack minH={'100vh'} direction={{ base: 'column', md: 'row' }}>
            <Flex p={8} flex={1} align={'center'} justify={'center'}>
                <Stack spacing={4} w={'full'} maxW={'md'}>
                    <Heading fontSize={'2xl'}>Đăng nhập vào tài khoản của bạn</Heading>
                    <form onSubmit={handleLogin}>
                        <FormControl id="email" mb="4" isRequired>
                            <FormLabel>Email</FormLabel>
                            <Input name="email" type="email" placeholder="Email" />
                        </FormControl>
                        <FormControl id="password" mb="4" isRequired>
                            <FormLabel>Mật khẩu</FormLabel>
                            <Input name="password" type="password" placeholder="Mật khẩu" />
                        </FormControl>
                        <Stack spacing={6}>
                            <Stack
                                direction={{ base: 'column', sm: 'row' }}
                                align={'start'}
                                justify={'space-between'}>
                                <Checkbox>Ghi nhớ</Checkbox>
                                <Text color={'blue.500'}>Quên mật khẩu?</Text>
                            </Stack>
                            <Button type="submit" colorScheme={'blue'} variant={'solid'} isLoading={loading}>
                                Đăng nhập
                            </Button>
                        </Stack>
                    </form>
                    <Text align={'center'}>
                        Bạn chưa có tài khoản? <Link to="/register" style={{ color: 'blue.500' }}>Đăng ký</Link>
                    </Text>
                </Stack>
            </Flex>
            <Flex flex={1}>
                <Image
                    alt={'Hình ảnh đăng nhập'}
                    objectFit={'cover'}
                    src={
                        'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80'
                    }
                />
            </Flex>
        </Stack>
    );
};

export default Login; 