import { Component } from '@angular/core';
import { AxiosService } from '../axios.service';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-event-creation',
  templateUrl: './event-creation.component.html',
  styleUrls: ['./event-creation.component.css'],
})
export class EventCreationComponent {
  newEvent: any = {};
  imageFiles: File[] = []; // To store selected image files
  fieldFocused: boolean = false;
  fieldTouched: boolean = false;
  fieldFocused2: boolean = false;
  fieldTouched2: boolean = false;
  fieldFocused3: boolean = false;
  fieldTouched3: boolean = false;
  eventForm: FormGroup;
  customPattern = /.*?,.*?,.*\d.*\d.*\d.*\d.*\d./;

constructor(private axiosService: AxiosService, private formBuilder: FormBuilder) {
    this.eventForm = this.formBuilder.group({
      name: [
        '',
        [
          Validators.required
        ]
      ],
      description: [
        '',
        [

        ]
      ],
      place: [
        '',
        [
          Validators.required,
          Validators.pattern(this.customPattern)
        ]
      ],
      dateTime: [
        '',
        [
          Validators.required,
          this.DateRangeValidator()
        ]
      ],
      photo: [
        '',
        [
          Validators.required
        ]
      ],
      category: [
        '',
        [
          Validators.required
        ]
      ]
    })
  }

DateRangeValidator(): Validators {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value) {
      const selectedDate = new Date(control.value);
      const currentDate = new Date();
      const minDate = new Date(currentDate);
      minDate.setDate(currentDate.getDate() + 1);
      const maxDate = new Date(currentDate);
      maxDate.setFullYear(currentDate.getFullYear() + 1);

      if (selectedDate >= minDate && selectedDate <= maxDate) {
        return null;
      } else {
        return { dateRange: true };
      }
    }
    return null;
  };
}

onSubmit(): void {

	if (this.eventForm.valid) {
		const userId = window.localStorage.getItem("userId");
		const title = this.newEvent.name;
		const description = this.newEvent.description;
		const dateTimeLocal = this.newEvent.dateTime;
		const place = this.newEvent.location;
		const category = this.newEvent.category;

		if (dateTimeLocal) {
		const date = new Date(dateTimeLocal + 'Z');
		const formattedDateTime = date.toISOString().substring(0, 23);
		const endpoint = `/api/create-event/${userId}`;
		const formData = new FormData();

		for (const file of this.imageFiles) {
			formData.append('photos', file, file.name);
		}

		formData.append('title', title);
		formData.append('description', description);
		formData.append('dateTime', formattedDateTime);
		formData.append('place', place);
		formData.append('category', category);

		this.axiosService.requestMultipart(
			"POST",
			endpoint,
			formData,
			);
			console.log('Form submitted!');
		} else {
			console.error('Invalid date and time.');
		}
	}
}

  onFileChange(event: any): void {
    this.imageFiles = event.target.files;
  }
}


