import { Component, OnInit, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit{
  isPasswordVisible = false;
  isPassword2Visible = false;
  uploadedFileName = '';
  registerForm: FormGroup;
  
  constructor(private el: ElementRef, private fb: FormBuilder) {
    this.registerForm = new FormGroup({
      firstName: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-z\s]*$/)]),
      lastName: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-z\s]*$/)]),
      dateOfBirth: new FormControl('', [Validators.required, this.validateDateOfBirth]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8), this.validatePassword]),
      confirmPassword: new FormControl('', [Validators.required, this.passwordMatch.bind(this)]),
      photo: new FormControl(''),
      privacy: new FormControl(false, [Validators.requiredTrue]),
    });
  }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      dateOfBirth: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required, this.passwordMatch.bind(this)]),
      photo: new FormControl(''),
      privacy: new FormControl(false, [Validators.requiredTrue]),
    }) as FormGroup;
  }

  togglePasswordVisibility() {
  const input = this.el.nativeElement.querySelector('#password') as HTMLInputElement;
    this.isPasswordVisible = !this.isPasswordVisible;
    input.type = this.isPasswordVisible ? 'text' : 'password';
  }

  togglePasswordVisibility2() {
    const input = this.el.nativeElement.querySelector('#confirm-password') as HTMLInputElement;
    this.isPassword2Visible = !this.isPassword2Visible;
    input.type = this.isPassword2Visible ? 'text' : 'password';
  }

  passwordMatch(control: FormControl): { [s: string]: boolean } | null {
    const passwordControl = this.registerForm?.get('password');
    if (passwordControl && control.value !== passwordControl.value) {
      return { 'passwordMismatch': true };
    }
    return null;
  }

  isValidFirstName(): boolean {
    const firstNameValue = this.registerForm.get('firstName')?.value;
    if (firstNameValue) {
      const pattern = /^[A-Za-z\s]*$/;
      return pattern.test(firstNameValue);
    }
    return true;
  }
  isValidLastName(): boolean {
    const lastNameValue = this.registerForm.get('lastName')?.value;
    if (lastNameValue) {
      const pattern = /^[A-Za-z\s]*$/;
      return pattern.test(lastNameValue);
    }
    return true;
  }
  validateDateOfBirth(control: AbstractControl) {
    const selectedDate = new Date(control.value);
    const currentDate = new Date();
    const age = currentDate.getFullYear() - selectedDate.getFullYear();

    if (age < 18){
      return { underage: true };
    }
    return null;
  }
  validatePassword(control: AbstractControl) {
    const password = control.value;
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(password);

    if (!hasNumber || !hasSpecialChar) {
      return { invalidPassword: true };
    }
    return null;
  }
  onSubmit() {
    if (this.registerForm.valid)
      console.log(2);
    else
      console.log(9);
  }
}