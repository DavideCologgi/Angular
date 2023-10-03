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

  NavbarToggleListener() {
    const navbarToggler: HTMLElement | null = document.querySelector(".navbar-toggler");
    const navbarMenu: HTMLElement | null = document.querySelector(".navbar-collapse");

    if (navbarToggler && navbarMenu) {
      navbarToggler.addEventListener("click", function () {
        navbarMenu.classList.toggle("open-menu");
      });
    }
  }

  ngOnInit() {
    this.NavbarToggleListener();
  }
}