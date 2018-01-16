import { Component } from '@angular/core';
import { AuthService } from '../../providers/auth-service/auth-service';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map'; 

@Component({
  selector: 'page-rating',
  templateUrl: 'lecture.html',
})
export class LecturePage {
  acourse:any;
  ccode:any;
  lectures:any;
  ratingcourse:number = 4;
  courserate:any;
  userid = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, private nav: NavController, private auth: AuthService) {
    this.ccode = this.navParams.get('ccode');
    let info = this.auth.getUserInfo();
    this.userid = info['userid'];
    console.log(this.ccode);
    this.http.get('http://ratingstudy.ddns.net/ratingstudy/course.php/.json?ccode="'+this.ccode+'"').map(res => res.json()).subscribe(
      data => {
          this.acourse = data.data;

          this.http.get('http://ratingstudy.ddns.net/ratingstudy/lecture.php/.json?cid="'+this.acourse[0].cid+'"').map(res => res.json()).subscribe(
          data => {
              this.lectures = data.data;
          },
          err => {
              console.log("Oops!");
          });

          this.http.get('http://ratingstudy.ddns.net/ratingstudy/ratecourse.php/.json?cid="'+this.acourse[0].cid+'"').map(res => res.json()).subscribe(
          data => {
            this.courserate = data.data[0].rate;
          },
          err => {
            console.log("Oops!");
          });

      },
      err => {
          console.log("Oops!");
      });
    //get lectures
    
  }

  submitratecourse(){
    this.http.get('http://ratingstudy.ddns.net/ratingstudy/ratecourse.php/.json?cid='+this.acourse[0].cid+'&crate='+this.ratingcourse+'&aid='+this.userid).map(res => res.json()).subscribe(
      data => {
        this.courserate = data.data;
       },
      err => {
        console.log("Oops!");
      });
  }

  toprofessorpage(pid){

  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad RatingPage');
  }

}
