import { Component, ViewChild } from '@angular/core';
import { AuthService } from '../../providers/auth-service/auth-service';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { Chart } from 'chart.js';

import 'rxjs/add/operator/map'; 

@Component({
  selector: 'page-rating',
  templateUrl: 'course.html',
})
export class CoursePage {
  @ViewChild('barCanvas') barCanvas;
  barChart: any;
  acourse:any;
  ccode:any;
  lectures:any;
  ratingcourse:number = 4;
  ratinglearn:number = 4;
  ratingexam:number = 4;
  ratingknowlage:number = 4;

  courserate:any;
  learningrate:number = 0;
  examrate:number = 0;
  knowlagerate:number = 0;
  numofvotes:number = 0;
  userid = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, private nav: NavController, private auth: AuthService) {
    this.ccode = this.navParams.get('ccode');
    let info = this.auth.getUserInfo();
    this.userid = info['userid'];
    console.log(this.ccode);
  }

  submitratecourse(){
    this.http.get('http://ratingstudy.ddns.net/ratingstudy/ratecourse.php/.json?ccode='+this.ccode+'&crate='+this.ratingcourse+'&lrate='+this.ratinglearn+'&erate='+this.ratingexam+'&krate='+this.ratingknowlage+'&aid='+this.userid).map(res => res.json()).subscribe(
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
    this.http.get('http://ratingstudy.ddns.net/ratingstudy/course.php/.json?ccode="'+this.ccode+'"').map(res => res.json()).subscribe(
      data => {
          this.acourse = data.data;

          this.http.get('http://ratingstudy.ddns.net/ratingstudy/lecture.php/.json?ccode="'+this.ccode+'"').map(res => res.json()).subscribe(
          data => {
            if(data.data[0]==null){
              this.lectures = [{pname:'error'}];
            }else{
              this.lectures = data.data;
            }
              
          },
          err => {
              console.log("Oops! Get lecture.php error");
          });

          this.http.get('http://ratingstudy.ddns.net/ratingstudy/ratecourse.php/.json?ccode='+this.ccode).map(res => res.json()).subscribe(
          data => {
            if(data.data[0].crate==0){
              this.courserate = 'No rate';
            }else{
              this.courserate = data.data[0].crate;
            }
            
            this.learningrate = data.data[0].lrate;
            this.examrate = data.data[0].erate;
            this.knowlagerate = data.data[0].krate;
          },
          err => {
            console.log("Oops! Get ratecourse.php error");
          });

      },
      err => {
          console.log("Oops! Get course.php error");
      });
    //get lectures
    
    this.barChart = new Chart(this.barCanvas.nativeElement, {
 
      type: 'bar',
      data: {
          labels: ["Learning", "Exam", "Knowlage"],
          datasets: [{
              label: '# of Votes',
              data: [this.learningrate, this.examrate, this.knowlagerate],
              backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(75, 192, 192, 0.2)'
                  
              ],
              borderColor: [
                  'rgba(255,99,132,1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(75, 192, 192, 1)'
              ],
              borderWidth: 1
          }]
      },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero:true
                  }
              }]
          }
      }

  });
  }

}
