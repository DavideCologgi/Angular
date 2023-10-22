import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
	profileForm: FormGroup;

	constructor(private formBuilder: FormBuilder, private router: Router) {
		this.profileForm = this.formBuilder.group({
			firstname: [
				'',
				[
					Validators.required,
					Validators.pattern(/^[A-Za-z]+$/)
				]
			],
			lastname: [
				'',
				[
					Validators.required,
					Validators.pattern(/^[A-Za-z]+$/)
				]
			],
			email: [
				'',
				[
					Validators.required,
					Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
				],
			]
		});
	}
	
	firstname: string = 'Alessio';
	lastname: string = 'Buonomo';
	oldEmail: string = 'ciccio.gamer89@gmail.com';
	newEmail: string = 'ciccio.gamer89@gmail.com';
	date: string = '17/09/1999';
	profilePhoto: string = '/assets/profile.jpg';
	
	modifyPermit: boolean = false;
	showButton: boolean = true;

	ModifyProfile() {
		this.modifyPermit = true;
		this.showButton = false;
	}

	EmailChange(tmp: string) {
		this.newEmail = tmp;
	}

	SaveChanges() {
		if (this.newEmail != this.oldEmail) {
			this.router.navigate(['/2FA-login']);
		}
		else {
			// salva firstname e lastname nel database
			window.location.reload();
		}
	}

	ReloadPage() {
		window.location.reload();
	}

	UploadNewPhoto(event: any) {
		const file = event.target.files[0]; // Ottieni il file selezionato dall'input
		if (file) {
			const reader = new FileReader();
			reader.onload = (e: any) => {
				this.profilePhoto = e.target.result; // Imposta l'immagine visualizzata sulla pagina con i dati del file caricato
			};
			reader.readAsDataURL(file);
		}
	}
}
