import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login-component/login.component';
import { RegisterComponent } from './register/register.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EventComponent } from './event/event.component';
import { LogoutComponent } from './logout/logout.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HeaderComponent,
    HomeComponent,
    FooterComponent,
    EventComponent,
    LogoutComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', title: 'Home Page', component: HeaderComponent},
      { path: 'home', title: 'Home Page', component: HomeComponent },
      { path: 'login', title: 'Login Page', component: LoginComponent},
      { path: 'register', title: 'Register Page', component: RegisterComponent},
      { path: 'event', title: 'Event Page', component: EventComponent},
    ])
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }

