import { Component, ElementRef } from '@angular/core';
import { AxiosService } from '../axios.service';
import { AxiosResponse } from 'axios';
import { Router } from '@angular/router';

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
		this.axiosService.request(
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
					this.axiosService.setAuthToken(response.data.accessToken);
        			this.router.navigate(['/home']);
				}
			  })
			  .catch(error => {
				console.error('An error occurred during login:', error);
			  })
	};
}
