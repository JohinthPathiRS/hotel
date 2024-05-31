import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginData = {
    username: '',
    password: ''
  };

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    this.http.post<any>('http://localhost:3000/login', this.loginData).subscribe(
      (response) => {
        // Successful login
        localStorage.setItem('token', response.token); // Store token in local storage
        this.router.navigate(['/dashboard']);
      },
      (error) => {
        // Login failed
        console.error('Login failed:', error);
        // Display error message to the user
      }
    );
  }
}
