import { Component, ElementRef } from '@angular/core';
import { AxiosService } from '../axios.service';
import { Router } from '@angular/router';
import axios from 'axios';

@Component({
	selector: 'app-login',
	template: 'Bonfire/login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css'],
})
export class LoginComponent {

	showError = false;
	errorMessage = '';
	isPasswordVisible = false;

	constructor(private el: ElementRef, private axiosService: AxiosService, private router: Router){}

	togglePasswordVisibility() {
		const input = this.el.nativeElement.querySelector('#pwd') as HTMLInputElement;
		this.isPasswordVisible = !this.isPasswordVisible;
		input.type = this.isPasswordVisible ? 'text' : 'password';
	}


	email: string = "";
	password: string = "";

	onSubmitLogin(): void {
		console.log(10);
		this.axiosService.request2(
			"POST",
			"/api/auth/signin",
			{
			email: this.email,
			password: this.password
			}
			).then(response => {
				if (response.data.error !== null) {
					this.showError = true;
					this.errorMessage = response.data.error;
				} else {
					console.log(response.data.access_token);
					window.localStorage.setItem("expiration_date", response.data.expiration_date)
					console.log(response.data.expiration_date);
        			this.router.navigate(['/home']);
				}
			  })
			  .catch(error => {
				console.error('An error occurred during login:', error);
			  })
	};
}
