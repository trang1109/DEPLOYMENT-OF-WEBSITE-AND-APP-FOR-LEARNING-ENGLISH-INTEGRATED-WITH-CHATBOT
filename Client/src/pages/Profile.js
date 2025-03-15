'use client'

import React, { useState, useEffect } from 'react';
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  AvatarBadge,
  IconButton,
  Center,
} from '@chakra-ui/react';
import { SmallCloseIcon } from '@chakra-ui/icons';

export default function UserProfileEdit() {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: '',
    avatar: '',
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUserData({
        username: user.username || '',
        email: user.email || '',
        password: '', // Password should not be pre-filled for security reasons
        avatar: user.image || 'https://bit.ly/sage-adebayo',
      });
    }
  }, []);

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}>
      <Stack
        spacing={4}
        w={'full'}
        maxW={'md'}
        bg={useColorModeValue('white', 'gray.700')}
        rounded={'xl'}
        boxShadow={'lg'}
        p={6}
        my={12}>
        <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
          Hồ sơ người dùng
        </Heading>
        <FormControl id="userName">
          <FormLabel>Biểu tượng người dùng</FormLabel>
          <Stack direction={['column', 'row']} spacing={6}>
            <Center>
              <Avatar size="xl" src={userData.avatar}>
                <AvatarBadge
                  as={IconButton}
                  size="sm"
                  rounded="full"
                  top="-10px"
                  colorScheme="red"
                  aria-label="remove Image"
                  icon={<SmallCloseIcon />}
                />
              </Avatar>
            </Center>
            <Center w="full">
              <Button w="full">Thay đổi biểu tượng</Button>
            </Center>
          </Stack>
        </FormControl>
        <FormControl id="userName" isRequired>
          <FormLabel>Tên người dùng</FormLabel>
          <Input
            placeholder="Tên người dùng"
            _placeholder={{ color: 'gray.500' }}
            type="text"
            value={userData.username}
            onChange={(e) => setUserData({ ...userData, username: e.target.value })}
          />
        </FormControl>
        <FormControl id="email" isRequired>
          <FormLabel>Địa chỉ email</FormLabel>
          <Input
            placeholder="email@example.com"
            _placeholder={{ color: 'gray.500' }}
            type="email"
            value={userData.email}
            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
          />
        </FormControl>
        <FormControl id="password" isRequired>
          <FormLabel>Mật khẩu</FormLabel>
          <Input
            placeholder="Mật khẩu"
            _placeholder={{ color: 'gray.500' }}
            type="password"
            value={userData.password}
            onChange={(e) => setUserData({ ...userData, password: e.target.value })}
          />
        </FormControl>
        <Stack spacing={6} direction={['column', 'row']}>
          <Button
            bg={'red.400'}
            color={'white'}
            w="full"
            _hover={{
              bg: 'red.500',
            }}>
            Hủy
          </Button>
          <Button
            bg={'blue.400'}
            color={'white'}
            w="full"
            _hover={{
              bg: 'blue.500',
            }}>
            Gửi
          </Button>
        </Stack>
      </Stack>
    </Flex>
  );
} 