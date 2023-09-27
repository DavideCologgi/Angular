import { Component, OnInit, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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
  
  constructor(private el: ElementRef) {
    this.registerForm = new FormGroup({
      firstName: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]),
      lastName: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]),
      dateOfBirth: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
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
  const input = this.el.nativeElement.querySelector('#pwd') as HTMLInputElement;
    this.isPasswordVisible = !this.isPasswordVisible;
    input.type = this.isPasswordVisible ? 'text' : 'password';
  }

  togglePasswordVisibility2() {
    const input = this.el.nativeElement.querySelector('#pwd2') as HTMLInputElement;
    this.isPassword2Visible = !this.isPassword2Visible;
    input.type = this.isPassword2Visible ? 'text' : 'password';
  }

  passwordMatch(control: FormControl): { [s: string]: boolean } | null {
    const passwordControl = this.registerForm?.get('password');
    if (passwordControl && control.value !== passwordControl.value
    ) {
      return { 'passwordMismatch': true };
    }
    return null;
  }

  onFirstNameBlur() {
    if (this.registerForm.get('firstName')?.hasError('pattern')) {
      const errorMessage = 'Il nome non deve contenere numeri o caratteri speciali.';
      console.error(errorMessage);
    }
  }

  onSubmit() {
    if (this.registerForm.valid)
      console.log(2);
    else
      console.log(9);
  }
}