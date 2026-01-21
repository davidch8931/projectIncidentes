import 'package:flutter/material.dart';
import 'package:movil_app/repositories/auth_repository.dart';
import 'package:movil_app/screens/home_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _usernameController = TextEditingController();
  final _passwordController = TextEditingController();
  final _authRepo = AuthRepository();
  bool _isLoading = false;

  void _handleLogin() async {
    setState(() => _isLoading = true);
    try {
      bool success = await _authRepo.login(
        _usernameController.text, 
        _passwordController.text
      );
      
      if (success && mounted) {
        // Navegar al Home y borrar historial para no volver al login con "atrás"
        Navigator.pushReplacement(
          context, 
          MaterialPageRoute(builder: (_) => const HomeScreen())
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString()), backgroundColor: Colors.red),
        );
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.all(15.0),
        child: Center(
          child: Column(
            children: [
              Text('Login'),
            ],
          ),
        ),
      ),
    );
  }
}