import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class ApiService {
  final String baseUrl =
      'http://localhost:8000/api/v1'; // Use your machine IP for real device
  final storage = const FlutterSecureStorage();

  Future<Map<String, String>> _getHeaders() async {
    String? token = await storage.read(key: 'token');
    return {
      'Content-Type': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }

  Future<http.Response> post(String endpoint, Map<String, dynamic> data) async {
    final response = await http.post(
      Uri.parse('$baseUrl$endpoint'),
      headers: await _getHeaders(),
      body: jsonEncode(data),
    );
    return response;
  }

  Future<http.Response> get(String endpoint) async {
    final response = await http.get(
      Uri.parse('$baseUrl$endpoint'),
      headers: await _getHeaders(),
    );
    return response;
  }
}

class AuthService {
  final ApiService api = ApiService();

  Future<bool> login(String email, String password) async {
    final response = await api.post('/auth/login', {
      'username': email, // FastAPI OAuth2 uses username field
      'password': password,
    });

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      await api.storage.write(key: 'token', value: data['access_token']);
      return true;
    }
    return false;
  }

  Future<bool> register(String email, String password, String fullName) async {
    final response = await api.post('/auth/register', {
      'email': email,
      'password': password,
      'full_name': fullName,
    });
    return response.statusCode == 201;
  }
}
