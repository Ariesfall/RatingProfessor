import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Md5 } from 'ts-md5/dist/md5'
import 'rxjs/add/operator/map';


/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

export class User{
  userid: string;
  email: string;
  school:string;
  year:number;
  accesslv:string;
  constructor(userid: string, email: string, school:string, year:number, accesslv:string) {
    this.userid = userid;
    this.email = email;
    this.school = school;
    this.year = year;
    this.accesslv = accesslv;
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
         credentials.password = Md5.hashStr(credentials.password+credentials.email).toString();
         this.auth = this.url+"login.php/.json?username="+credentials.email+"&password="+credentials.password;
         console.log(this.auth);
         this.http.get(this.auth).map(res => res.json()).subscribe(
          data => {
            console.log(data);
            this.posts = data.data[0];
            if(this.posts==null){
                console.log("Uncorrect email or password");
                access=false;
            }
            else{
              console.log("Login access OK!");
              console.log(this.posts.aid);
              access=true;
              this.currentUser = new User(this.posts.aid, credentials.email, this.posts.school, this.posts.year, this.posts.accesslv);
            }
            observer.next(access);
            observer.complete();
          },
          err => {
              console.log("Oops!login error");
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
          credentials.password = Md5.hashStr(credentials.password+credentials.email).toString();
          var access;
         // At this point store the credentials to your backend!
          this.auth = this.url+"register.php/.json?username="+credentials.email+"&password="+credentials.password+"&school="+credentials.school+"&year="+credentials.year;
          console.log(this.auth);
          this.http.get(this.auth).map(res => res.json()).subscribe(
            data => {
              this.posts = data;
              if(data.success==false){
                access=false;
                console.log("Oops! register.php error");
              }
              else{
                access=true;
              }
              observer.next(access);
              observer.complete();
            },
            err => {
              console.log("Oops! error to db");
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
