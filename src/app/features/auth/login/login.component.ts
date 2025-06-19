import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginSocialComponent } from "../login-social/login-social.component";
import { UserService } from '../../../shares/services/user.service';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['../../../shares/styles/button.css', './login.component.css']
})
export class LoginComponent {

  loading: boolean = false;
  submitted: boolean = false;
  dataLogin!: FormGroup;

  showPass: boolean = false;

  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    this.dataLogin = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  login() {
    if (this.loading) return;
    this.loading = true;
    this.submitted = true;

    if (this.dataLogin.invalid) {
      this.loading = false;
      return;
    }

    const inforLogin = this.dataLogin.value;
    this.userService.login(inforLogin).subscribe({
      next: (res) => {
        this.loading = false;
        this.userService.saveUser(res);
      },
      error: (err) => {
        this.loading = false;
      }
    });
  }
}
