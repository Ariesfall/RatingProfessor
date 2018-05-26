import { Component, ViewChild } from '@angular/core';
import { AuthService } from '../../providers/auth-service/auth-service';
import { ToastController, Platform, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { Chart } from 'chart.js';
import { CoursePage } from '../../pages/rating/course';

import 'rxjs/add/operator/map';


@Component({
  selector: 'page-rating',
  templateUrl: 'lecture.html',
})
export class LecturePage {
  @ViewChild('radarCanvas') radarCanvas;
  radarChart: any;

  userid = '';
  pid: String;

  lecturedata: any;
  coursedata:any;
  lecturescore2:any;

  constructor( public toastCtrl: ToastController, platform: Platform, public navCtrl: NavController, public navParams: NavParams, public http: Http, private nav: NavController, private auth: AuthService) {
    this.pid = this.navParams.get('pid');
    let info = this.auth.getUserInfo();
    //this.userid = info['userid'];
    console.log(this.pid);
    //get lectures
  }

  tocoursepage(ccode){
    this.navCtrl.push(CoursePage,{
      ccode : ccode
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LecturePage');
    this.http.get('http://ratingstudy.ddns.net/ratingstudy/lecture.php/.json?pid='+this.pid).map(res => res.json()).subscribe(
      data => {
          this.lecturedata = data.data;
          console.log(this.lecturedata);
          this.coursedata = data.data2;
          console.log(this.coursedata);
          this.lecturescore2 = data.data3[0];
          this.toupdatecanvas();
      },
      err => {
          console.log("Oops! Get course.php error");
      });
  }

  toupdatecanvas() {

     this.radarChart = new Chart(this.radarCanvas.nativeElement, {
       type: 'radar',
       data: {
         labels: ['Clear', 'Understand', 'Schedule', 'Material', 'Helpful'],
         datasets: [{
             label: this.lecturescore2.votenum +' average score',
             data: [this.lecturescore2.q1score, this.lecturescore2.q2score, this.lecturescore2.q3score, this.lecturescore2.q4score, this.lecturescore2.q5score],
             backgroundColor: 'rgba(54, 162, 235, 0.2)',
             borderColor: 'rgba(54, 162, 235, 1)',
             scaleSteps: 5,
             scaleStepWidth: 1,
             scaleStartValue: 1,
             borderWidth: 1

           }]
       },
       options: {
         scale: {
             // Hides the scale
             display: true,
             ticks: {
               // changes here
               min : 1,
               max : 5
           }
         },
         title: {
           display: true,
           text: 'The overall behaver of lecturer in 5 standards'
         }
       }
     });
   }

  /* mailto(mail) {
    setTimeout(()=>{
       window.open('mailto:'+mail+'?body=Contect from RatingStudy');
    },500);
  }*/

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    this.ionViewDidLoad();
    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

}
