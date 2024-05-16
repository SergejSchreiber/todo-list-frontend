import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  token: string = '';

  constructor(private as:AuthService, private router: Router) {}

  async login() {
    try {
      let resp = await this.as.loginWithUsernameAndPassword(this.username, this.password) as any;
      localStorage.setItem('token', resp.token);
      this.router.navigateByUrl('/todos')
    } catch(e) {
      alert('Login fehlgeschlagen')
      console.error(e);
    }
  }

}
