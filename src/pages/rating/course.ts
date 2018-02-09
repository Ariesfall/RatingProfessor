import { Component, ViewChild } from '@angular/core';
import { AuthService } from '../../providers/auth-service/auth-service';
import { ToastController, Platform, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { Chart } from 'chart.js';
import { LecturePage } from '../../pages/rating/lecture';

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

  comments:any;
  commentcourse: String;

  defultrate: string = 'open_rate';
  isAndroid: boolean = false;

  constructor( public toastCtrl: ToastController, platform: Platform, public navCtrl: NavController, public navParams: NavParams, public http: Http, private nav: NavController, private auth: AuthService) {
    this.ccode = this.navParams.get('ccode');
    let info = this.auth.getUserInfo();
    this.userid = info['userid'];
    this.isAndroid = platform.is('android');
    console.log(this.ccode);
    //get lectures
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad CoursePage');
    this.http.get('http://ratingstudy.ddns.net/ratingstudy/course.php/.json?ccode='+this.ccode).map(res => res.json()).subscribe(
      data => {
          this.acourse = data.data;

          this.http.get('http://ratingstudy.ddns.net/ratingstudy/lecture.php/.json?ccode='+this.ccode).map(res => res.json()).subscribe(
          data => {
            if(data.success==false){
              this.lectures = [{pname:'No Presistance'}];
            }else{
              this.lectures = data.data;
            }
              
          },
          err => {
              console.log("Oops! Get lecture.php error");
          });

          this.loadrating();

      },
      err => {
          console.log("Oops! Get course.php error");
      });
      this.loadcomment();
      
  }

  submitratecourse(){
    var link  = 'http://ratingstudy.ddns.net/ratingstudy/ratecourse.php/.json?ccode='+this.ccode+'&crate='+this.ratingcourse+'&lrate='+this.ratinglearn+'&erate='+this.ratingexam+'&krate='+this.ratingknowlage+'&aid='+this.userid;
    //console.log(link);
    this.http.get(link).map(res => res.json()).subscribe(
      data => {
        if (data.successfull==false){
          this.showToast('middle', 'Rate fail, please try again ');
          this.courserate = this.learningrate = this.examrate= this.knowlagerate = 4;
        }else{
          this.showToast('middle', 'Rate Successfull'); 
          this.courserate = this.learningrate = this.examrate= this.knowlagerate = 4;
          this.loadrating();
        }
       },
      err => {
        console.log("Oops! ratecourse.php error");
      });
  }
 
  submitratecomment(){
    var link  = 'http://ratingstudy.ddns.net/ratingstudy/comment.php/.json?ccode='+this.ccode+'&cm='+this.commentcourse+'&aid='+this.userid;
    //console.log(link);
    this.http.get(link).map(res => res.json()).subscribe(
      data => {
        if (data.successfull==false){
          this.showToast('middle', 'Comment fail, please try again ');
          this.commentcourse=null;
        }else{
          this.showToast('middle', 'Comment Successfull');
          this.commentcourse=null;
          this.loadcomment();
        }
       },
      err => {
        console.log("Oops! comment.php error");
      });

  }

  tolecturepage(pid){
    console.log("tolecturepage pid "+pid);
    this.navCtrl.push(LecturePage,{
      pid : pid
    });
  }
  
  
  toupdatecanvas() {
    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
          labels: ["Overall","Learning", "Exam", "Knowlage"],
          datasets: [{
              label: ' ',
              data: [this.courserate, this.learningrate, this.examrate, this.knowlagerate],
              backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)'
                  
              ],
              borderColor: [
                  'rgba(255,99,132,1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
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

  

  loadrating(){
    this.http.get('http://ratingstudy.ddns.net/ratingstudy/ratecourse.php/.json?ccode='+this.ccode).map(res => res.json()).subscribe(
      data => {
        if(data.data[0].crate==0 || !data.data[0].crate || data.data[0].crate==null){
          this.courserate = 'No rate';
        }else{
          this.courserate = data.data[0].crate;
        }
        
        this.learningrate = data.data[0].lrate;
        this.examrate = data.data[0].erate;
        this.knowlagerate = data.data[0].krate;
        this.toupdatecanvas();
        
      },
      err => {
        console.log("Oops! Get ratecourse.php error");
      });
  }
  loadcomment(){
    this.http.get('http://ratingstudy.ddns.net/ratingstudy/comment.php/.json?ccode='+this.ccode).map(res => res.json()).subscribe(
      data => {
          this.comments = data.data;
      },
      err => {
          console.log("Oops! Get commit.php error");
      });
  }

  showToast(position: string, Msg: string) {
    let toast = this.toastCtrl.create({
      message: Msg,
      duration: 1000,
      position: position
    });

    toast.present(toast);
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    //this.ionViewDidLoad();
    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

  
}
