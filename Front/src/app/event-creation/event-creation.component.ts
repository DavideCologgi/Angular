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

    // Access values from the DOM elements
    const title = this.titleField.nativeElement.value;
    const description = this.descriptionField.nativeElement.value;
    const dateTime = this.dateTimeField.nativeElement.value;
    const place = this.placeField.nativeElement.value;
    const category = this.categoryField.nativeElement.value;

    // You can now use these variables in your request
    this.axiosService.request(
      "POST",
      "/api/create-event",
      {
        title,
        description,
        dateTime,
        place,
        category
      }
    );

    console.log('Form submitted!');
  }
}
