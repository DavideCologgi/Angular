import { Component, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(private router: Router) {}

  login() {
    this.router.navigateByUrl('/login');
  }
  register() {
    this.router.navigateByUrl('/register');
  }
}
