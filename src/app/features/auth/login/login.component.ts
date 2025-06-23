import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../shares/services/user.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../shares/services/common.service';

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
        private userService: UserService,
        private router: Router,
        private commonService: CommonService
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
                this.commonService.showNotify('Đăng nhập thành công', 'success');
                this.router.navigate(['/dictionary']);

            },
            error: (err) => {
                console.log(err);
                this.loading = false;
                this.commonService.showNotify('Đã có lỗi xảy ra vui lòng đăng nhập lại', 'danger');
            }
        });
    }
}
