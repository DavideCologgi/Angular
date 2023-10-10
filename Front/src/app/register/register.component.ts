import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AxiosService } from '../axios.service';
import { Router } from '@angular/router';
import axios from 'axios';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit{

  showError = false;
  errorMessage = '';
  isPasswordVisible = false;
  isPassword2Visible = false;
  uploadedFileName = '';
  @ViewChild('fileInput') fileInput: any;
  registerForm: FormGroup;

  constructor(private el: ElementRef, private fb: FormBuilder, private axiosService: AxiosService, private router: Router) {
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

	// onSubmitRegister(): void {
	// 	console.log(11)
	// 	this.axiosService.request(
	// 		"POST",
	// 		"/api/auth/signup",
	// 		{
	// 		firstName: this.registerForm?.get('firstName')?.value,
	// 		lastName: this.registerForm?.get('lastName')?.value,
  //     dateOfBirth: this.registerForm?.get('dateOfBirth')?.value,
	// 		email: this.registerForm?.get('email')?.value,
	// 		password: this.registerForm?.get('password')?.value,
	// 		confirmPassword: this.registerForm?.get('confirmPassword')?.value,
	// 		fileName: this.registerForm?.get('fileName')?.value
	// 		}
	// 	);
	// }

  onSubmitRegister(): void {
    console.log(11);
    const formData = new FormData();
    formData.append('firstName', this.registerForm?.get('firstName')?.value);
    formData.append('lastName', this.registerForm?.get('lastName')?.value);
    formData.append('dateOfBirth', this.registerForm?.get('dateOfBirth')?.value);
    formData.append('email', this.registerForm?.get('email')?.value);
    formData.append('password', this.registerForm?.get('password')?.value);
    formData.append('confirmPassword', this.registerForm?.get('confirmPassword')?.value);
    formData.append('checkbox', this.registerForm?.get('privacy')?.value);

    if (this.fileInput.nativeElement.files[0]) {
      formData.append('photo', this.fileInput.nativeElement.files[0]);
    } else {
      const emptyBlob = new Blob([], { type: 'application/octet-stream' });
      formData.append('photo', emptyBlob, 'empty.jpg');
    }

    if (this.registerForm?.get('dateOfBirth')?.value) {
      formData.append('dateOfBirth', this.registerForm?.get('dateOfBirth')?.value);
    } else {
      formData.append('dateOfBirth', '0000-00-00');
    }

    axios.post("/api/auth/signup", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      withCredentials: true,
    })
    .then(response => {
      if (response.data === "Registered Successfully") {
        this.showError = false;
        this.errorMessage = '';
        this.router.navigate(['/login']);
      } else {
        this.showError = true;
        this.errorMessage = response.data;
      }
    })
    .catch(error => {
      this.showError = true;
      this.errorMessage = 'An unknown error occurred';
    });
  }
}
