import React from 'react';
import { Box, Container, Heading, Text, Stack, Image, Divider } from '@chakra-ui/react';

const About = () => {
  return (
    <Box bg="gray.50" color="gray.700" py={10}>
      <Container maxW="6xl">
        <Stack spacing={8} align="center">
          <Heading as="h1" size="2xl" textAlign="center" color="blue.600">
            Giới thiệu về EnglishMentor
          </Heading>
          <Image
            src="https://blog-cdn.italki.com/wp-content/uploads/sites/2/2021/03/30084731/How-can-I-learn-English-well-in-one-month.jpg"
            alt="EnglishMentor"
            borderRadius="md"
            boxShadow="lg"
            maxW="80%"
          />
          <Divider borderColor="gray.300" />
          <Text fontSize="lg" textAlign="center" maxW="3xl">
            Chào mừng bạn đến với EnglishMentor, nền tảng học tiếng Anh hàng đầu với sự hỗ trợ của chatbot. Chúng tôi cung cấp các khóa học đa dạng từ cơ bản đến nâng cao, giúp bạn cải thiện kỹ năng ngôn ngữ một cách hiệu quả.
          </Text>
          <Text fontSize="lg" textAlign="center" maxW="3xl">
            Tại EnglishMentor, chúng tôi tin rằng học ngôn ngữ là chìa khóa để mở ra thế giới mới và tạo ra những cơ hội đáng giá. Hãy cùng chúng tôi bắt đầu hành trình học tập của bạn và khám phá những phương pháp học tập tiên tiến nhất.
          </Text>
          <Divider borderColor="gray.300" />
          <Text fontSize="md" textAlign="center" color="gray.500">
            "Ngôn ngữ là cửa sổ của tâm hồn." - G. Whittier
          </Text>
        </Stack>
      </Container>
    </Box>
  );
};

export default About; 