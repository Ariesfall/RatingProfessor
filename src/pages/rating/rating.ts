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
  @ViewChild('barCanvas') barCanvas;
  barChart2: any;
  isAndroid: boolean = false;

  userid = '';
  
  ccode:string;
  pid:string;
  pname:string;
  cname: string;
  school: string;
  
  lecturescore:any;
  lecturecm:any;
  lectures:any;

  q1:any;
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
        this.lecturescore = data.data;
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
    this.loadrating();
  }

  loadrating(){
    this.http.get('http://ratingstudy.ddns.net/ratingstudy/lecture.php/.json?ccode='+this.ccode+'&pid='+this.pid).map(res => res.json()).subscribe(
      data => {
        if(data.data[0].crate==0 || !data.data[0].crate || data.data[0].crate==null){
          this.lecturescore = 'No rate';
        }else{
          this.lecturescore = data.data;
          this.lecturecm = data.data2;
        }
        this.toupdatecanvas();
        
      },
      err => {
        console.log("Oops! Get lecture.php error");
      });
  }
  

  toupdatecanvas() {
    this.barChart2 = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
          labels: ["Overall","Learning", "Exam", "Knowlage"],
          datasets: [{
              label: ' ',
              data: [0, 0, 0, 0],
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
