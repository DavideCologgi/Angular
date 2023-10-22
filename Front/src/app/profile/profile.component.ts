import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
	profileForm: FormGroup;

	constructor(private formBuilder: FormBuilder) {
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
	email: string = 'ciccio.gamer89@gmail.com';
	date: string = '17/09/1999';
	profilePhoto: string = '/assets/profile.jpg';
	
	modifyPermit: boolean = false;
	showButton: boolean = true;

	ModifyProfile() {
		this.modifyPermit = true;
		this.showButton = false;
	}

	ageValidator(minAge: number) {
		return (control: FormGroup): { [key: string]: boolean } | null => {
		  const birthDate = new Date(control.value);
		  const today = new Date();
		  const age = today.getFullYear() - birthDate.getFullYear();

		  if (age < minAge) {
			return { 'minAge': true };
		  }
		  return null;
		};
	};

	SaveChanges() {
		//logica per il salvataggio dei nuovi dati dell'utente
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
