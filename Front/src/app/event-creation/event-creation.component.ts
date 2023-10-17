import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { AxiosService } from '../axios.service';

@Component({
  selector: 'app-event-creation',
  templateUrl: './event-creation.component.html',
  styleUrls: ['./event-creation.component.css'],
})
export class EventCreationComponent implements AfterViewInit {

  @ViewChild('titleField') titleField!: ElementRef;
  @ViewChild('descriptionField') descriptionField!: ElementRef;
  @ViewChild('dateTimeField') dateTimeField!: ElementRef;
  @ViewChild('placeField') placeField!: ElementRef;
  @ViewChild('categoryField') categoryField!: ElementRef;

  constructor(private axiosService: AxiosService) { }

  ngAfterViewInit(): void {
    throw new Error('Method not implemented.');
  }

  onFormSubmit(event: Event): void {
    event.preventDefault();
    const userId = window.localStorage.getItem("userId");
    const title = this.titleField.nativeElement.value;
    const description = this.descriptionField.nativeElement.value;
    const dateTimeLocal = this.dateTimeField.nativeElement.value;
    const place = this.placeField.nativeElement.value;
    const category = this.categoryField.nativeElement.value;
    const formattedDateTime = new Date(dateTimeLocal).toISOString().substring(0, 23);
    const endpoint = `/api/create-event/${userId}`;

    this.axiosService.request(
      "POST",
      endpoint,
      {
        title,
        description,
        dateTime: formattedDateTime,
        place,
        category,
      }
    );

    console.log('Form submitted!');
  }


}
