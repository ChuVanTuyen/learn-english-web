import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../shares/services/user.service';
import { CommonService } from '../../../shares/services/common.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-register',
    imports: [
        ReactiveFormsModule
    ],
    templateUrl: './register.component.html',
    styleUrls: ['../../../shares/styles/button.css', './register.component.css']
})
export class RegisterComponent {

    showPass: boolean = false;
    showRePass: boolean = false;
    submitted: boolean = false;
    loading: boolean = false;
    dataRegister!: FormGroup;
    @ViewChildren('inputElement') inputFields!: QueryList<ElementRef>;

    constructor(
        private userService: UserService,
        private commonService: CommonService,
        private router: Router
    ) { }

    ngOnInit() {
        this.dataRegister = new FormGroup({
            name: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]),
            email: new FormControl('', [Validators.required, Validators.email]),
            phoneNumber: new FormControl(''),
            password: new FormControl('', [Validators.required, Validators.minLength(6)]),
            rePassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
            agree_term: new FormControl('')
        });
    }

    handleEnter(index: number, event: Event) {
        event.preventDefault();
        const inputsArray = this.inputFields.toArray();
        if (index < inputsArray.length - 1) {
            inputsArray[index + 1].nativeElement.focus();
        } else {
            this.submit();
        }
    }

    submit() {
        if (this.loading && this.dataRegister.invalid) return;
        this.submitted = true;
        if (this.dataRegister.value.password !== this.dataRegister.value.rePassword) return;

        this.loading = true;
        this.userService.register(this.dataRegister.value).subscribe({
            next: (res) => {
                this.loading = false;
                this.commonService.showNotify('Đăng ký tài khoản thành công', 'success');
                this.router.navigate(['/auth/user']);
            },
            error: err => {
                this.loading = false;
                this.commonService.showNotify('Đã có lỗi xảy ra vui lòng đăng ký lại', 'danger');
            }
        })
    }
}
