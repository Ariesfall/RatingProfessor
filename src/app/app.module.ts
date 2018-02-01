import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { SearchPage } from '../pages/search/search';
import { ContactPage } from '../pages/contact/contact';
import { UserPage } from '../pages/user/user';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { AccountPage } from '../pages/account/account';
import { RegisterPage } from '../pages/register/register';
import { LoginPage } from '../pages/login/login';
import { RatingPage } from '../pages/rating/rating';
import { LecturePage } from '../pages/rating/lecture';
import { CoursePage } from '../pages/rating/course';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthService } from '../providers/auth-service/auth-service';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    SearchPage,
    ContactPage,
    UserPage,
    HomePage,
    TabsPage,
    AccountPage,
    LoginPage,
    RegisterPage,
    RatingPage,
    CoursePage,
    LecturePage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    SearchPage,
    ContactPage,
    UserPage,
    HomePage,
    TabsPage,
    AccountPage,
    LoginPage,
    RegisterPage,
    RatingPage,
    CoursePage,
    LecturePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthService
  ]
})
export class AppModule {}
