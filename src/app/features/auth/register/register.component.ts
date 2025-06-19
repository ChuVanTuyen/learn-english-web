import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

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

  constructor() {}

  ngOnInit() {
    this.dataRegister = new FormGroup({
      name: new FormControl('', [ Validators.required, Validators.minLength(2), Validators.maxLength(100) ]),
      email: new FormControl('', [ Validators.required, Validators.email ]),
      phoneNumber: new FormControl(''),
      password: new FormControl('', [ Validators.required, Validators.minLength(6) ]),
      rePassword: new FormControl('', [ Validators.required, Validators.minLength(6) ]),
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
    if ( this.loading && this.dataRegister.invalid ) return;
    this.submitted = true;
    if(this.dataRegister.value.password !== this.dataRegister.value.rePassword) return;
  }
}
