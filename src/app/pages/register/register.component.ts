import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerObj: any = {
    username: '',
    password: ''
  };

  constructor(private http: HttpClient, private router: Router) {}

  onRegister() {
    this.http.post('http://localhost:3000/register', this.registerObj).subscribe(
      (res: any) => {
        if (res.message === 'User registered successfully') {
          alert('Registration successful!');
          this.router.navigateByUrl('/login');
        } else {
          alert(res.message);
        }
      },
      (error) => {
        console.error('Error registering user', error);
        alert('Registration failed');
      }
    );
  }
}
