import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';


/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

export class User {
  name: string;
  email: string;
  constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
  }
}

@Component({
})
export class AuthService {
  url = "http://ratingstudy.ddns.net/ratingstudy/";
  currentUser: User;
  posts: any;
  auth: string;
  constructor(public http: Http){}
   public login(credentials) {
     if (credentials.email === null || credentials.password === null) {
       return Observable.throw("Please insert credentials");
     } else {
       return Observable.create(observer => {
         var access;
         // At this point make a request to your backend to make a real check!
         this.auth = this.url+"login.php/.json?username='"+credentials.email+"'&password='"+credentials.password+"'";
         console.log(this.auth);
         this.http.get(this.auth).map(res => res.json()).subscribe(
          data => {
            console.log(data);
            this.posts = data.data[0];
            if(this.posts==null){
                console.log("Uncorrect email or pw");
                access=false;
            }
            else{
              console.log("access OK!");
              console.log(this.posts.aid);
              access=true;
              this.currentUser = new User(this.posts.aid, credentials.email);
            }
            observer.next(access);
            observer.complete();
          },
          err => {
              console.log("Oops! error");
              access=false;
              observer.next(access);
              observer.complete();
          });
       });
     }
   }
  
   public register(credentials) {
     if (credentials.email === null || credentials.password === null || credentials.school ===null || credentials.year===null) {
       return Observable.throw("Please insert credentials");
     } else {
       return Observable.create(observer => {
          var access;
         // At this point store the credentials to your backend!
          this.auth = this.url+"register.php/.json?username='"+credentials.email+"'&password='"+credentials.password+"'&school='"+credentials.school+"'&year="+credentials.year;
          this.http.get(this.auth).map(res => res.json()).subscribe(
            data => {
              this.posts = data;
              if(data.success==false){
                access=false;
              }
              else{
                access=true;
              }
              observer.next(access);
              observer.complete();
            },
            err => {
              console.log("Oops! error");
              observer.next(false);
              observer.complete();
          });
       });
     }
   }
  
   public getUserInfo() : User {
     return this.currentUser;
   }
  
   public logout() {
     return Observable.create(observer => {
       this.currentUser = null;
       observer.next(true);
       observer.complete();
     });
   }

}
