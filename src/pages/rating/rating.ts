import { Component, ViewChild } from '@angular/core';
import { AuthService } from '../../providers/auth-service/auth-service';
import { ToastController, Platform, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { Chart } from 'chart.js';
import { LecturePage } from '../../pages/rating/lecture';
import 'rxjs/add/operator/map'; 

@Component({
  selector: 'page-rating',
  templateUrl: 'rating.html',
})

export class RatingPage {
  //@ViewChild('barCanvas') barCanvas;
  @ViewChild('radarCanvas') radarCanvas;
  @ViewChild('lineCanvas') lineCanvas;
  //barChart2: any;
  radarChart: any;
  lineChart: any;
  isAndroid: boolean = false;

  userid = '';
  
  ccode:string;
  pid:string;
  pname:string;
  cname: string;
  school: string;

  lecturescore1:any;
  lecturescore2:any;
  lecturecm:any;
  lectures:any;

  numofvot:any;

  q1:number;
  q2:any;
  q3:any;
  q4:any;
  q5:any;
  text:string;

  constructor(public toastCtrl: ToastController, platform: Platform, public navCtrl: NavController, public navParams: NavParams, public http: Http, private auth: AuthService) {
    this.ccode = this.navParams.get('ccode');
    this.pid = this.navParams.get('pid');
    this.pname = this.navParams.get('pname');
    this.cname = this.navParams.get('cname');
    this.school = this.navParams.get('cschool');
    let info = this.auth.getUserInfo();
    this.userid = info['userid'];
    this.isAndroid = platform.is('android');
    console.log(this.ccode,this.pid,this.userid);
  }

  submitratelecture(){
    this.http.get('http://ratingstudy.ddns.net/ratingstudy/lecture.php/.json?cid='+this.ccode+'&pid='+this.pid+'&q1='+this.q1+'&aid='+this.userid).map(res => res.json()).subscribe(
      data => {
        this.lecturescore2 = data.data;
       },
      err => {
        console.log("Oops!");
      });
  }

  tolecturepage(pid){
    console.log("tolecturepage pid "+pid);
    this.navCtrl.push(LecturePage,{
      pid : pid
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RatingPage');
    //get lectures
    this.loaddataing();
  }

  loaddataing(){
    this.http.get('http://ratingstudy.ddns.net/ratingstudy/lecture.php/.json?ccode='+this.ccode+'&pid='+this.pid).map(res => res.json()).subscribe(
      data => {
          this.lecturescore1 = data.data1;
          this.lecturescore2 = data.data2;
          this.lecturecm = data.data3;
        this.toupdatecanvas();
        
      },
      err => {
        console.log("Oops! Get lecture.php error");
      });
  }
  

  toupdatecanvas() {
    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: ['Week1', 'Week2', 'Week3', 'Week4', 'Week5', 'Week6'],
        datasets: [{
            label: '# of Votes: ' + this.numofvot,
            data: [2.9, 4.9, 4.1, 2.1, 4, 3.1],
            backgroundColor: [
                  'rgba(54, 162, 235, 0.2)'
              ],
            borderColor: [
                  'rgba(54, 162, 235, 1)'
              ],
            borderWidth: 1
          }]
      },
      options: {
        scales: {
          yAxes: [{
              ticks: {
                  beginAtZero: true,
                  max : 5
              }
          }]
      },
        title: {
          display: true,
          text: 'Lecture Score per Week'
        }
      }
    });

    this.radarChart = new Chart(this.radarCanvas.nativeElement, {
      type: 'radar',
      data: {
        labels: ['Clear', 'Understand', 'Schedule', 'Material', 'Helpful'],
        datasets: [{
            label: '# of Votes: ' + this.numofvot,
            data: [2.9, 4.9, 4.1, 2.1, 4],
            backgroundColor: [
                  'rgba(54, 162, 235, 0.2)'
              ],
            borderColor: [
                  'rgba(54, 162, 235, 1)'
              ],
            pointBackgroundColor: 'rgba(54, 162, 235, 0.2)',
            pointStyle: 'circle',
            borderWidth: 1
          }]
      },
      options: {
        scale: {
            // Hides the scale
            display: true,
            ticks: {
              // changes here
              beginAtZero: true,
              max : 5
          }
        },
        title: {
          display: true,
          text: 'Lecturer attribute tendency'
        }
      }
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
