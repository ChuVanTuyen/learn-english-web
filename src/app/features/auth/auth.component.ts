import { Component } from '@angular/core';
import { LoginSocialComponent } from "./login-social/login-social.component";
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth',
  imports: [
    LoginSocialComponent,
    RouterOutlet,
    RouterLink
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {

  isLogin: boolean = true;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    this.router.events.subscribe(val => {
      if (val instanceof NavigationEnd) {
        this.isLogin = val.url.includes('login')
      }
    });
  }
}
