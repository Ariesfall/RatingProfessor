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
  username: string;
  school:string;
  year:number;
  accesslv:string;
  constructor(userid: string, email: string, username:string, school:string, year:number, accesslv:string) {
    this.userid = userid;
    this.email = email;
    this.username = username;
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
         var hashpassword = Md5.hashStr(credentials.password+credentials.email).toString();
         this.auth = this.url+"login.php/.json?username="+credentials.email+"&password="+hashpassword;
         console.log(this.auth);
         this.http.get(this.auth).map(res => res.json()).subscribe(
          data => {
            console.log(data);
            this.posts = data.data[0];
            if(this.posts==null){
                console.log("Uncorrect email or password");
                access=1;
            }else if(data.access==99){
                console.log("Account not verified");
                access=99;
            }else if(data.access==3){
              console.log("Account has been block");
              access=3;
            }else if(data.access==2 || data.access==0){
              console.log("Login access OK!");
              console.log(this.posts.aid);
              access=0;
              this.currentUser = new User(this.posts.aid, credentials.email, this.posts.username, this.posts.school, this.posts.year, this.posts.accesslv);
            }else {
              console.log("Not access right!");
              console.log(this.posts.aid);
              access=1;
            }
            observer.next(access);
            observer.complete();
          },
          err => {
              console.log("Oops!login error");
              access=999;
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
          var hashpassword = Md5.hashStr(credentials.password+credentials.email).toString();
          var access;
         // At this point store the credentials to your backend!
          this.auth = this.url+"register.php/.json?email="+credentials.email+"&password="+hashpassword+"&username="+credentials.username+"&school="+credentials.school+"&year="+credentials.year;
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
