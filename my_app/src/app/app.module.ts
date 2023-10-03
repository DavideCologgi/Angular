import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IonicModule } from '@ionic/angular';
import { LoginComponent } from './login-component/login.component';
import { RegisterComponent } from './register/register.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HeaderComponent,
    HomeComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', title: 'Home Page', component: HomeComponent},
      { path: 'home', title: 'Home Page', component: HomeComponent },
      { path: 'login', title: 'Login Page', component: LoginComponent},
      { path: 'register', title: 'Register Page', component: RegisterComponent},
    ])
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
