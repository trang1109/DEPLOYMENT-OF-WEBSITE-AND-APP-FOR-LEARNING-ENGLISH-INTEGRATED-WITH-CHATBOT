import 'dart:convert';


import '/model/register.dart';
import '/model/user.dart';
import 'package:dio/dio.dart';

import 'sharepre.dart';

class API {
  final Dio _dio = Dio();
  String baseUrl = "http://192.168.1.13:3100";

  API() {
    _dio.options.baseUrl = "$baseUrl/api/";
  }

  Dio get sendRequest => _dio;
}

class APIRepository {
  API api = API();

  Map<String, dynamic> header(String token) {
    return {
      "Access-Control-Allow-Origin": "*",
      'Content-Type': 'application/json',
      'Accept': '*/*',
      'Authorization': 'Bearer $token'
    };
  }

  Future<List<dynamic>> getVocabulariesByCategory(String categoryId) async {
    try {
      final Response res = await api.sendRequest.get(
        'vocabulary/by-category/$categoryId',
        options: Options(
          headers: header(""),
        ),
      );

      if (res.statusCode == 200) {
        List<dynamic> vocabularyList = res.data['vocabularies'];
        return vocabularyList;
      } else {
        throw Exception('Failed to fetch vocabularies by category');
      }
    } catch (ex) {
      print(ex);
      rethrow;
    }
  }


  Future<String> register(Signup user) async {
    try {
      final body = jsonEncode({
        "username": user.username,
        "email": user.email,
        "password": user.password,
        "phone": user.phone,
        "role": user.role,
        "status": user.status
      });
      Response res = await api.sendRequest.post('auth/register',
          options: Options(
            headers: header('no token'),
            contentType: Headers.jsonContentType,
          ),
          data: body);
      if (res.statusCode == 200) {
        // Đăng ký thành công
        print("ok");
        return "ok";
      } else if (res.statusCode == 400) {
        // Email đã tồn tại
        print("Email is exist");
        return "Email is exist";
      } else {
        // Đăng ký thất bại
        print("fail");
        return "signup fail";
      }
    } catch (ex) {
      // Xử lý lỗi
      print(ex);
      rethrow;
    }
  }


  Future<String> login(String email, String password) async {
    try {
      final body = jsonEncode({'email': email, 'password': password});
      Response res = await api.sendRequest.post('auth/login',
          options: Options(headers: header('no token')), data: body);
      if (res.statusCode == 200) {
        final Map<String, dynamic> data = res.data;
        final String token = data['token']; // Lấy token từ phản hồi
        print("ok login");
        return token;
      } else if (res.statusCode == 400) {
        // Tài khoản chưa được đăng ký hoặc mật khẩu không đúng
        return "Unregistered account or wrong password";
      } else {
        // Đăng nhập thất bại
        return "login fail";
      }
    } catch (ex) {
      // Xử lý lỗi
      print(ex);
      rethrow;
    }
  }

  Future<Response> getNotifications() async {
    try {
      final Response res = await api.sendRequest.get(
        '/notifications',
        options: Options(
          headers: header(""),
        ),
      );
      print(res);

      if (res.statusCode == 200) {
        return res;
      } else {
        throw Exception('Failed to fetch notifications');
      }
    } catch (ex) {
      print(ex);
      rethrow;
    }
  }

  Future<Response> getStatistics() async {
    try {
      Response response = await api.sendRequest.get('/stats/', options: Options(
        headers: header(""),
      ));

      if (response.statusCode == 200) {
        return response;
      } else {
        throw Exception('Failed to fetch statistics');
      }
    } catch (ex) {
      print(ex);
      rethrow;
    }
  }

  // Thêm phần sau vào class APIRepository
  Future<List<dynamic>> getAllCategories() async {
    try {
      final Response res = await api.sendRequest.get(
        'category/search',
        options: Options(
          headers: header(""),
        ),
      );

      if (res.statusCode == 200) {
        List<dynamic> categoryList = res.data['categories'];
        return categoryList;
      } else {
        throw Exception('Failed to fetch categories');
      }
    } catch (ex) {
      print(ex);
      rethrow;
    }
  }


  Future<String> changePasswordApp(String id, String currentPassword, String newPassword, String token) async {
    try {
      final body = jsonEncode({
        'currentPassword': currentPassword,
        'newPassword': newPassword
      });
      Response res = await api.sendRequest.put(
        'user/changePassword/$id',
        options: Options(headers: header(token)),
        data: body,
      );
      if (res.statusCode == 200) {
        return "Password changed successfully";
      } else if (res.statusCode == 400) {
        return "Current password is incorrect";
      } else {
        return "Failed to change password";
      }
    } catch (ex) {
      print(ex);
      rethrow;
    }
  }

  Future<String> resetPassword(String email) async {
    try {
      final body = jsonEncode({
        'email': email,
      });
      Response res = await api.sendRequest.post(
        'auth/forgot-password',
        options: Options(
          headers: {
            'Content-Type': 'application/json',
          },
        ),
        data: body,
      );
      if (res.statusCode == 200) {
        return "Reset password email sent successfully";
      } else if (res.statusCode == 400) {
        return "Email not found";
      } else {
        return "Failed to send reset password email";
      }
    } catch (ex) {
      print(ex);
      rethrow;
    }
  }

  Future<String> createFolder(String userId, String name, String token) async {
    try {
      print("ddax vo");
      final body = jsonEncode({
        "userId": userId,
        "name": name,
      });
      final Response res = await api.sendRequest.post(
        'folder',
        options: Options(
          headers: header("no"),
          contentType: Headers.jsonContentType,
        ),
        data: body,
      );
      if (res.statusCode == 201) {
        return "Folder created successfully";
      } else {
        return "Failed to create folder";
      }
    } catch (ex) {
      print(ex);
      rethrow;
    }
  }

  Future<String> updateFolder(String folderId, String name, String token) async {
    try {
      final body = jsonEncode({
        "name": name,
      });
      final Response res = await api.sendRequest.put(
        'folder/$folderId',
        options: Options(
          headers: header(token),
          contentType: Headers.jsonContentType,
        ),
        data: body,
      );
      if (res.statusCode == 200) {
        return "Folder updated successfully";
      } else {
        return "Failed to update folder";
      }
    } catch (ex) {
      print(ex);
      rethrow;
    }
  }

  Future<String> deleteFolder(String folderId, String token) async {
    try {
      final Response res = await api.sendRequest.delete(
        'folder/$folderId',
        options: Options(
          headers: header(token),
        ),
      );
      if (res.statusCode == 200) {
        return "Folder deleted successfully";
      } else {
        return "Failed to delete folder";
      }
    } catch (ex) {
      print(ex);
      rethrow;
    }
  }

  Future<List<dynamic>> getAllFolders(String token) async {
    try {
      final Response res = await api.sendRequest.get(
        'folder',
        options: Options(
          headers: header(token),
        ),
      );
      if (res.statusCode == 200) {
        List<dynamic> folderList = res.data;
        return folderList;
      } else {
        throw Exception('Failed to fetch folders');
      }
    } catch (ex) {
      print(ex);
      rethrow;
    }
  }

  Future<dynamic> getFolderById(String folderId, String token) async {
    try {
      final Response res = await api.sendRequest.get(
        'folder/$folderId',
        options: Options(
          headers: header(token),
        ),
      );
      if (res.statusCode == 200) {
        List<dynamic> folderList = res.data;
        return folderList;
      } else {
        throw Exception('Failed to fetch folder');
      }
    } catch (ex) {
      print(ex);
      rethrow;
    }
  }

  Future<List<dynamic>> getFoldersByUserId(String userId) async {
    try {
      final Response res = await api.sendRequest.get(
        'folder/user/$userId',
        options: Options(
          headers: header("no"),
        ),
      );
      if (res.statusCode == 200) {
        final Map<String, dynamic> responseData = res.data;
        print(responseData);

        final List<dynamic> folderList = responseData['data']; // Giả sử danh sách được nhúng trong trường 'data'
        return folderList;
      } else {
        throw Exception('Failed to fetch folders by user ID');
      }
    } catch (ex) {
      print(ex);
      rethrow;
    }
  }

  Future<String> createTopic(String userId, String topicName, String description, String folderId, String token) async {
    try {
      final body = jsonEncode({
        "userId": userId,
        "topicName": topicName,
        "description": description,
        "folderId": folderId,
      });
      final Response res = await api.sendRequest.post(
        'topic',
        options: Options(
          headers: header(token),
          contentType: Headers.jsonContentType,
        ),
        data: body,
      );
      if (res.statusCode == 201) {
        return "Topic created successfully";
      } else {
        return "Failed to create topic";
      }
    } catch (ex) {
      print(ex);
      rethrow;
    }
  }

  Future<String> updateTopic(String topicId, String topicName, String description, String folderId, String token) async {
    try {
      final body = jsonEncode({
        "topicName": topicName,
        "description": description,
        "folderId": folderId,
      });
      final Response res = await api.sendRequest.put(
        'topic/$topicId',
        options: Options(
          headers: header(token),
          contentType: Headers.jsonContentType,
        ),
        data: body,
      );
      if (res.statusCode == 200) {
        return "Topic updated successfully";
      } else {
        return "Failed to update topic";
      }
    } catch (ex) {
      print(ex);
      rethrow;
    }
  }

  Future<String> deleteTopic(String topicId, String token) async {
    try {
      final Response res = await api.sendRequest.delete(
        'topic/$topicId',
        options: Options(
          headers: header(token),
        ),
      );
      if (res.statusCode == 200) {
        return "Topic deleted successfully";
      } else {
        return "Failed to delete topic";
      }
    } catch (ex) {
      print(ex);
      rethrow;
    }
  }

  Future<dynamic> getTopicById(String topicId, String token) async {
    try {
      final Response res = await api.sendRequest.get(
        'topic/$topicId',
        options: Options(
          headers: header(token),
        ),
      );
      if (res.statusCode == 200) {
        return res.data;
      } else {
        throw Exception('Failed to fetch topic');
      }
    } catch (ex) {
      print(ex);
      rethrow;
    }
  }

  Future<List<dynamic>> getAllTopics(String token) async {
    try {
      final Response res = await api.sendRequest.get(
        'topic',
        options: Options(
          headers: header(token),
        ),
      );
      if (res.statusCode == 200) {
        List<dynamic> topicList = res.data;
        return topicList;
      } else {
        throw Exception('Failed to fetch topics');
      }
    } catch (ex) {
      print(ex);
      rethrow;
    }
  }

  Future<List<dynamic>> getTopicsByUserId(String userId, String token) async {
    try {
      final Response res = await api.sendRequest.get(
        'topic/user/$userId',
        options: Options(
          headers: header(token),
        ),
      );
      if (res.statusCode == 200) {
        final Map<String, dynamic> responseData = res.data;
        final List<dynamic> topicList = responseData['data'];
        return topicList;
      } else {
        throw Exception('Failed to fetch topics by user ID');
      }
    } catch (ex) {
      print(ex);
      rethrow;
    }
  }


  Future<String> addVocabularyToTopic(String topicId, String word, String definition) async {
    try {
      final body = jsonEncode({"topicId": topicId, "word": word, "definition": definition});
      final Response res = await api.sendRequest.post(
        '/word',
        data: body,
      );
      if (res.statusCode == 201) {
        return "Vocabulary added to topic successfully";
      } else {
        return "Failed to add vocabulary to topic";
      }
    } catch (ex) {
      print(ex);
      rethrow;
    }
  }

  Future<String> deleteVocabularyFromTopic(String vocabularyId) async {
    try {
      final Response res = await api.sendRequest.delete(
        '/word/$vocabularyId',
      );
      if (res.statusCode == 200) {
        return "Vocabulary deleted from topic successfully";
      } else {
        return "Failed to delete vocabulary from topic";
      }
    } catch (ex) {
      print(ex);
      rethrow;
    }
  }

  Future<String> updateVocabularyInTopic(String vocabularyId, String word, String definition) async {
    try {
      final body = jsonEncode({"word": word, "definition": definition});
      final Response res = await api.sendRequest.put(
        '/word/$vocabularyId',
        data: body,
      );
      if (res.statusCode == 200) {
        return "Vocabulary updated in topic successfully";
      } else {
        return "Failed to update vocabulary in topic";
      }
    } catch (ex) {
      print(ex);
      rethrow;
    }
  }

  Future<List<dynamic>> getAllVocabulariesInTopic(String topicId) async {
    try {
      final Response res = await api.sendRequest.get(
        '/word/topic/$topicId',
      );
      if (res.statusCode == 200) {
        return res.data['data'];
      } else {
        throw Exception('Failed to fetch vocabularies in topic');
      }
    } catch (ex) {
      print(ex);
      rethrow;
    }
  }

  Future<dynamic> getVocabularyById(String vocabularyId) async {
    try {
      final Response res = await api.sendRequest.get(
        '/word/$vocabularyId',
      );
      if (res.statusCode == 200) {
        return res.data['data'];
      } else {
        throw Exception('Failed to fetch vocabulary');
      }
    } catch (ex) {
      print(ex);
      rethrow;
    }
  }

  Future<String> markVocabularyImportant(String vocabularyId, bool isImportant) async {
    try {
      final body = jsonEncode({"wordId": vocabularyId, "isImportant": isImportant});
      print(vocabularyId);

      final Response res = await api.sendRequest.put(
        '/word/mark-important',
        data: body,
      );
      if (res.statusCode == 200) {
        return "Vocabulary marked as important successfully";
      } else {
        return "Failed to mark vocabulary as important";
      }
    } catch (ex) {
      print(ex);
      rethrow;
    }
  }

  Future<String> trackVocabularyStatus(String vocabularyId, String status) async {
    try {
      final body = jsonEncode({"wordId": vocabularyId, "status": status});
      final Response res = await api.sendRequest.put(
        '/word/track-status',
        data: body,
      );
      if (res.statusCode == 200) {
        return "Vocabulary status updated successfully";
      } else {
        return "Failed to update vocabulary status";
      }
    } catch (ex) {
      print(ex);
      rethrow;
    }
  }

  Future<String> unMarkVocabularyImportant(String vocabularyId) async {
    try {
      final Response res = await api.sendRequest.put(
        '/word/unmark-important/$vocabularyId',
      );
      if (res.statusCode == 200) {
        return "Vocabulary unmarked as important successfully";
      } else {
        return "Failed to unmark vocabulary as important";
      }
    } catch (ex) {
      print(ex);
      rethrow;
    }
  }


  Future<User> current(String token) async {
    try {
      // Tạo header với token được đính kèm trong phần Authorization
      Map<String, String> headers = {'Authorization': '$token'};

      // Gửi yêu cầu API với header chứa token
      Response res = await api.sendRequest.get('/user/profile', options: Options(headers: headers));
      print(res);
      // Trích xuất dữ liệu phía trong "user"
      var userData = res.data['user'];

      // Trả về đối tượng User từ dữ liệu nhận được
      return User.fromJson(userData);
    } catch (ex) {
      // Xử lý ngoại lệ nếu có
      print(ex);
      rethrow;
    }
  }
}
