import { Component } from '@angular/core';
import { AxiosService } from '../axios.service';

@Component({
  selector: 'app-event-creation',
  templateUrl: './event-creation.component.html',
  styleUrls: ['./event-creation.component.css'],
})
export class EventCreationComponent {
  newEvent: any = {};
  imageFiles: File[] = []; // To store selected image files

  constructor(private axiosService: AxiosService) {}

  onSubmit(): void {
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

  onFileChange(event: any): void {
    this.imageFiles = event.target.files;
  }
}


