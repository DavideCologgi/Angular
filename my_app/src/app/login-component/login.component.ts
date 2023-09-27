import { Component, ElementRef } from '@angular/core';

@Component({
	selector: 'app-login',
	template: 'Bonfire/login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css'],
})
export class LoginComponent {
	isPasswordVisible = false;

	constructor(private el: ElementRef){}

	togglePasswordVisibility() {
		const input = this.el.nativeElement.querySelector('#pwd') as HTMLInputElement;
		this.isPasswordVisible = !this.isPasswordVisible;
		input.type = this.isPasswordVisible ? 'text' : 'password';
	}
}