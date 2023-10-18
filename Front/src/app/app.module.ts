import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { EventBoardComponent } from './event-board/event-board.component';
import { EventCardComponent } from './event-card/event-card.component';
import { EventCreationComponent } from './event-creation/event-creation.component';
import { EventInfoComponent } from './event-info/event-info.component';
import { EventBlankComponent } from './event-blank/event-blank.component';
import { TwoFALoginComponent } from './two-fa-login/two-fa-login.component';
import { ProfileComponent } from './profile/profile.component';
import { EventPersonalComponent } from './event-personal/event-personal.component';


import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatExpansionModule} from '@angular/material/expansion';


import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { register } from 'swiper/element/bundle';
register();

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		RegisterComponent,
		HeaderComponent,
		HomeComponent,
		FooterComponent,
		ForgotPasswordComponent,
		ResetPasswordComponent,
		EventBoardComponent,
		EventCardComponent,
		EventCreationComponent,
		EventBlankComponent,
		TwoFALoginComponent,
		ProfileComponent,
		EventPersonalComponent,
	],
	imports: [
		MatExpansionModule,
		EventInfoComponent,
		BrowserModule,
		AppRoutingModule,
		IonicModule,
		FormsModule,
		ReactiveFormsModule,
		MatSlideToggleModule,
		MatButtonModule,
		MatMenuModule,
		MatCardModule,
		MatIconModule,
		RouterModule.forRoot([
			{ path: '', title: 'Eventify/Home', component: HomeComponent },
			{ path: 'home', title: 'Eventify/Home', component: HomeComponent },
			{ path: 'login', title: 'Eventify/Login', component: LoginComponent },
			{ path: 'register', title: 'Eventify/Register', component: RegisterComponent },
			{ path: 'profile', title: 'Eventify/profile', component: ProfileComponent },
			{ path: 'forgot-password', title: 'Eventify/Forgot-Password', component: ForgotPasswordComponent },
			{ path: 'reset-password', title: 'Eventify/Reset-password', component: ResetPasswordComponent },
			{ path: 'event-board', title: 'Eventify/Event-board', component: EventBoardComponent },
			{ path: 'event-card', title: 'Eventify/Event-info', component: EventCardComponent },
			{ path: 'event-creation', title: 'Eventify/Event-creation', component: EventCreationComponent },
			{ path: 'event-info', title: 'Eventify/Event-info', component: EventInfoComponent },
			{ path: '2FA-login', title: 'Eventify/2FA-login', component: TwoFALoginComponent },
			{ path: 'my-events', title: 'Eventify/my-events', component: EventPersonalComponent }
		]),
		BrowserAnimationsModule,
		MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule,
	],
	providers: [],
	bootstrap: [AppComponent],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }