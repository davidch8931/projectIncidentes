class AuthResponse {
  final String access;
  final String refresh;

  AuthResponse({required this.access, required this.refresh});

  // crear el objeto desde el JSON que llega de Django
  factory AuthResponse.fromJson(Map<String, dynamic> json) {
    return AuthResponse(
      access: json['access'],
      refresh: json['refresh'],
    );
  }
}