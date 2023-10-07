import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AxiosService } from '../axios.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent {

  constructor(private router: Router, private axiosService: AxiosService) {}
}
