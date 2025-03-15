import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import {
    Box, Text, Container, VStack, Divider, Heading, Image,
    Button, HStack, Input, Select, Progress, Stack, Badge,
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
    Grid, GridItem, Flex
} from '@chakra-ui/react';
import { FaVolumeUp } from 'react-icons/fa';
import axios from 'axios';
import vocabApi from '../apis/vocabApi';
import categoryApi from '../apis/categoryApi';
const axios = require('axios');
require('dotenv').config();
const LearningDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const [vocabularies, setVocabularies] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [mode, setMode] = useState('flashcard');
    const [showAnswer, setShowAnswer] = useState(false);
    const [userInput, setUserInput] = useState('');
    const [isCorrect, setIsCorrect] = useState(null);
    const [score, setScore] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [chatHistory, setChatHistory] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [categoryDetails, setCategoryDetails] = useState(null);
    const [selectedPrompt, setSelectedPrompt] = useState('');

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (!user) {
            toast({
                title: "Authentication Required",
                description: "You must be logged in to access this page.",
                status: "warning",
                duration: 5000,
                isClosable: true,
            });
            navigate('/login');
            return;
        }

        const fetchVocabulariesByCategory = async (categoryId) => {
            try {
                const data = await vocabApi.getVocabulariesByCategory(categoryId);
                setVocabularies(data.vocabularies);
            } catch (error) {
                console.error('Lỗi khi lấy từ vựng theo danh mục:', error);
            }
        };

        const fetchCategoryDetails = async (categoryId) => {
            try {
                const data = await categoryApi.getDetailCategory(categoryId);
                setCategoryDetails(data.category);
            } catch (error) {
                console.error('Lỗi khi lấy chi tiết chủ đề:', error);
            }
        };

        fetchVocabulariesByCategory(id);
        fetchCategoryDetails(id);
    }, [id, navigate, toast]);

    const handleNext = () => {
        if (currentIndex + 1 === vocabularies.length) {
            setIsModalOpen(true);
        } else {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % vocabularies.length);
            setShowAnswer(false);
            setUserInput('');
            setIsCorrect(null);
        }
    };

    const handlePrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + vocabularies.length) % vocabularies.length);
        setShowAnswer(false);
        setUserInput('');
        setIsCorrect(null);
    };

    const checkAnswer = (correctAnswer) => {
        const isAnswerCorrect = userInput.toLowerCase() === correctAnswer.toLowerCase();
        setIsCorrect(isAnswerCorrect);
        if (isAnswerCorrect) {
            setScore((prevScore) => prevScore + 10);
        } else {
            setScore((prevScore) => prevScore - 5);
        }
    };

    const resetLearning = () => {
        setCurrentIndex(0);
        setShowAnswer(false);
        setUserInput('');
        setIsCorrect(null);
        setScore(0);
        setIsModalOpen(false);
    };

    const handlePromptSelection = (prompt) => {
        setSelectedPrompt(prompt);
        setChatInput(prompt);
    };

    const handleSendMessage = async () => {
        if (chatInput.trim()) {
            setChatHistory([...chatHistory, { sender: 'user', message: chatInput }]);
            try {
                const response = await axios.post(
                    'https://api.openai.com/v1/chat/completions',
                    {
                        model: 'gpt-3.5-turbo',
                        messages: [{ role: 'user', content: ` ${chatInput}` }],
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
                        }
                    }
                );
                const botMessage = response.data.choices[0].message.content;
                setChatHistory((prevHistory) => [
                    ...prevHistory,
                    { sender: 'bot', message: botMessage }
                ]);
            } catch (error) {
                console.error('Error communicating with ChatGPT:', error);
                setChatHistory((prevHistory) => [
                    ...prevHistory,
                    { sender: 'bot', message: 'Sorry, there was an error processing your request.' }
                ]);
            }
            setChatInput('');
        }
    };

    if (vocabularies.length === 0) {
        return (
            <Box textAlign="center" p={8} bg="gray.50" borderRadius="md" boxShadow="md">
                <Text fontSize="2xl" fontWeight="semibold" color="teal.700">
                    Hiện tại chưa có từ vựng nào trong chủ đề này để học.
                </Text>
                <Text fontSize="lg" color="gray.600" mt={3}>
                    Vui lòng quay lại sau hoặc chọn một chủ đề khác để tiếp tục.
                </Text>
            </Box>
        );
    }

    const currentVocabulary = vocabularies[currentIndex];

    const prompts = [
        `Hãy giải thích từ "${currentVocabulary.word}" trong ngữ cảnh của chủ đề: ${categoryDetails?.name}.`,
        `Hãy tạo một câu sử dụng từ "${currentVocabulary.word}" liên quan đến chủ đề: ${categoryDetails?.name}.`,
        `Bạn có thể đưa ra một ví dụ khác về từ "${currentVocabulary.word}" trong chủ đề: ${categoryDetails?.name}?`
    ];

    const renderContent = () => {
        switch (mode) {
            case 'flashcard':
                return (
                    <Box
                        p={6}
                        borderWidth="1px"
                        borderRadius="lg"
                        boxShadow="lg"
                        bg={showAnswer ? 'blue.50' : 'white'}
                        textAlign="center"
                        cursor="pointer"
                        onClick={() => setShowAnswer(!showAnswer)}
                    >
                        <Image
                            src={currentVocabulary.imageURL}
                            alt={currentVocabulary.word}
                            boxSize="150px"
                            objectFit="cover"
                            mx="auto"
                            mb={4}
                        />
                        <Text fontWeight="bold" fontSize="3xl" color="blue.700">
                            {currentVocabulary.word}
                        </Text>
                        {showAnswer && (
                            <>
                                <Text fontSize="lg" color="gray.700" mt={2}>
                                    {currentVocabulary.meaning}
                                </Text>
                                <Text fontSize="md" color="gray.500" mt={1}>
                                    Phát âm: {currentVocabulary.pronunciation}
                                </Text>
                                <Button
                                    leftIcon={<FaVolumeUp />}
                                    colorScheme="teal"
                                    variant="solid"
                                    mt={2}
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        new Audio(currentVocabulary.audioURL).play();
                                    }}
                                >
                                    Nghe phát âm
                                </Button>
                            </>
                        )}
                        <Text fontSize="sm" color="gray.500" mt={2}>
                            {showAnswer ? 'Nhấn để ẩn' : 'Nhấn để hiển thị nghĩa'}
                        </Text>
                    </Box>
                );
            case 'fill-in-the-blank':
                return (
                    <Box p={6} borderWidth="1px" borderRadius="lg" boxShadow="lg">
                        <Text fontSize="lg" mb={4}>
                            {currentVocabulary.description.replace(currentVocabulary.word, '_____')}
                        </Text>
                        <Input
                            placeholder="Điền từ"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onBlur={() => checkAnswer(currentVocabulary.word)}
                        />
                        {isCorrect !== null && (
                            <Text mt={2} color={isCorrect ? 'green.500' : 'red.500'} fontWeight="bold">
                                {isCorrect ? 'Chính xác!' : `Sai rồi! Đáp án đúng là: ${currentVocabulary.word}`}
                            </Text>
                        )}
                    </Box>
                );
            case 'audio-recognition':
                return (
                    <Box p={6} borderWidth="1px" borderRadius="lg" boxShadow="lg">
                        <Button
                            leftIcon={<FaVolumeUp />}
                            colorScheme="teal"
                            variant="solid"
                            mb={4}
                            onClick={() => new Audio(currentVocabulary.audioURL).play()}
                        >
                            Nghe phát âm
                        </Button>
                        <Input
                            placeholder="Nhập từ bạn nghe được"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onBlur={() => checkAnswer(currentVocabulary.word)}
                        />
                        {isCorrect !== null && (
                            <Text mt={2} color={isCorrect ? 'green.500' : 'red.500'} fontWeight="bold">
                                {isCorrect ? 'Chính xác!' : `Sai rồi! Đáp án đúng là: ${currentVocabulary.word}`}
                            </Text>
                        )}
                    </Box>
                );
            default:
                return null;
        }
    };

    return (
        <Container maxW="container.xl" p={8} backgroundColor="gray.50" minH="100vh">
            <Grid
                templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                gap={8}
            >
                {/* Learning Section */}
                <GridItem>
                    <Container
                        maxW="full"
                        p={8}
                        borderWidth="1px"
                        borderRadius="xl"
                        boxShadow="lg"
                        bg="white"
                        height="700px"
                    >
                        <VStack spacing={8}>
                            <Heading as="h2" size="lg" color="teal.600" textAlign="center">
                                Học Từ Vựng
                            </Heading>
                            {categoryDetails && (
                                <Box 
                                    p={4} 
                                    borderWidth="1px" 
                                    borderRadius="md" 
                                    boxShadow="md" 
                                    bg="teal.50" 
                                    textAlign="center"
                                >
                                    <Text fontSize="lg" color="teal.800" fontWeight="bold">
                                        Chủ đề: {categoryDetails.name}
                                    </Text>
                                </Box>
                            )}
                            <Badge colorScheme="purple" fontSize="lg">
                                Điểm của bạn: {score}
                            </Badge>
                            <Select
                                value={mode}
                                onChange={(e) => {
                                    setMode(e.target.value);
                                    resetLearning();
                                }}
                                variant="filled"
                                focusBorderColor="teal.500"
                                bg="gray.100"
                                _hover={{ bg: "gray.200" }}
                            >
                                <option value="flashcard">Flashcard</option>
                                <option value="fill-in-the-blank">Điền từ</option>
                                <option value="audio-recognition">Nhận diện âm thanh</option>
                            </Select>
                            {renderContent()}
                            <HStack justify="space-between" width="100%">
                                <Button
                                    onClick={handlePrevious}
                                    isDisabled={vocabularies.length <= 1}
                                    colorScheme="teal"
                                    variant="solid"
                                    _hover={{ bg: "teal.600" }}
                                >
                                    Trước
                                </Button>
                                <Button
                                    onClick={handleNext}
                                    isDisabled={vocabularies.length <= 1}
                                    colorScheme="teal"
                                    variant="solid"
                                    _hover={{ bg: "teal.600" }}
                                >
                                    Tiếp theo
                                </Button>
                            </HStack>
                            <Progress
                                value={(currentIndex + 1) / vocabularies.length * 100}
                                size="sm"
                                colorScheme="blue"
                                borderRadius="lg"
                            />
                            <Divider />
                        </VStack>

                        <Modal isOpen={isModalOpen} onClose={resetLearning}>
                            <ModalOverlay />
                            <ModalContent>
                                <ModalHeader>Kết thúc học từ vựng</ModalHeader>
                                <ModalCloseButton />
                                <ModalBody>
                                    <Text fontSize="lg">Bạn đã hoàn thành tất cả các từ!</Text>
                                    <Text fontSize="lg" mt={4}>
                                        Điểm của bạn: {score}
                                    </Text>
                                </ModalBody>
                                <ModalFooter>
                                    <Button colorScheme="teal" onClick={resetLearning}>
                                        Bắt đầu lại
                                    </Button>
                                </ModalFooter>
                            </ModalContent>
                        </Modal>
                    </Container>
                </GridItem>

                {/* Chatbot Section */}
                <GridItem>
                    <Container
                        maxW="full"
                        p={8}
                        borderWidth="1px"
                        borderRadius="xl"
                        boxShadow="lg"
                        bg="white"
                        height="900px"
                    >
                        <Heading as="h2" size="lg" color="teal.600" textAlign="center" mb={6}>
                            Chatbot
                        </Heading>
                        <Box
                            h="500px"
                            overflowY="auto"
                            mb={6}
                            p={4}
                            borderWidth="1px"
                            borderRadius="lg"
                            bg="gray.100"
                        >
                            {chatHistory.map((chat, index) => (
                                <Flex
                                    key={index}
                                    justify={chat.sender === 'user' ? 'flex-end' : 'flex-start'}
                                >
                                    <Box
                                        bg={chat.sender === 'user' ? 'teal.100' : 'gray.200'}
                                        p={3}
                                        borderRadius="md"
                                        mb={2}
                                        maxW="80%"
                                    >
                                        <Text fontSize="md" color="gray.700">
                                            {chat.message}
                                        </Text>
                                    </Box>
                                </Flex>
                            ))}
                        </Box>
                        <VStack spacing={4} mb={4}>
                            {prompts.map((prompt, index) => (
                                <Button
                                    key={index}
                                    onClick={() => handlePromptSelection(prompt)}
                                    colorScheme="teal"
                                    variant="outline"
                                    width="100%"
                                >
                                    {prompt}
                                </Button>
                            ))}
                        </VStack>
                        <HStack>
                            <Input
                                placeholder="Nhập tin nhắn..."
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                focusBorderColor="teal.500"
                                bg="gray.100"
                                _hover={{ bg: "gray.200" }}
                            />
                            <Button
                                colorScheme="teal"
                                onClick={handleSendMessage}
                                _hover={{ bg: "teal.600" }}
                            >
                                Gửi
                            </Button>
                        </HStack>
                    </Container>
                </GridItem>
            </Grid>
        </Container>
    );
};

export default LearningDetail;
