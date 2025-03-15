import 'dart:convert';
import 'package:dio/dio.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
void main() async {
  await dotenv.load();  
  runApp(MyApp());
}

class ChatService {
  final Dio _dio = Dio();
  final String _apiKey = dotenv.env['OPENAI_API_KEY']!;

  Future<String> sendMessage(String message) async {
    try {
      final response = await _dio.post(
        'https://api.openai.com/v1/chat/completions',
        options: Options(
          headers: {
            'Authorization': 'Bearer $_apiKey',
            'Content-Type': 'application/json',
          },
        ),
        data: jsonEncode({
          "model": "gpt-3.5-turbo", // Specify the model
          "messages": [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": message}
          ],
        }),
      );

      if (response.statusCode == 200) {
        final data = response.data;
        final choices = data['choices'] as List<dynamic>;
        if (choices.isNotEmpty) {
          return choices.first['message']['content'].toString();
        } else {
          return "No response from ChatGPT";
        }
      } else {
        throw Exception('Failed to get response');
      }
    } catch (e) {
      print(e);
      return "Error occurred while communicating with ChatGPT: $e";
    }
  }
}
