import { Component, ViewChild } from '@angular/core';
import { AuthService } from '../../providers/auth-service/auth-service';
import { ViewController, ModalController, ToastController, Platform, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { Chart } from 'chart.js';
import { LecturePage } from '../../pages/rating/lecture';
import { RatingPage } from '../../pages/rating/rating';
import { Storage } from '@ionic/storage';

import 'rxjs/add/operator/map';

@Component({
  selector: 'page-rating',
  templateUrl: 'course.html',
})
export class CoursePage {
  @ViewChild('barCanvas') barCanvas;
  barChart: any;

  time:number = 0;
  acourse:any;
  ccode:any;
  lectures:any;
  subscribe:boolean=true;
  nowyear:any;

  getrate:boolean=false;
  anonymous:boolean=false;

  ratingcourse:number;
  ratinglearn:number;
  ratingexam:number;
  ratingknow:number;
  resubmitdate:any;
  limit:number = 5;

  courserate:any;
  learningrate:number = 0;
  examrate:number = 0;
  knowlagerate:number = 0;
  pastrate:any = {crate : 0};
  pastratedata:any;
  pastvotenum:number = 0;
  numofvotes;
  userid = '';
  username = '';
  useryear;


  comments:any;
  commentcourse: String;

  defultrate: string = 'past_rate';
  isAndroid: boolean = false;

  constructor(
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    platform: Platform,
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: Http,
    private storage: Storage,
    private auth: AuthService
  ) {
    this.ccode = this.navParams.get('ccode');

    let info = this.auth.getUserInfo();
    //this.userid = info['userid'];
    //this.username = info['username'];
    //this.useryear = info['year'];
    storage.get('userid').then((data) => {this.userid = data;});
    storage.get('year').then((data) => {this.useryear = data;});
    storage.get('username').then((data) => {this.username = data;});

    this.isAndroid = platform.is('android');
    console.log(this.ccode);

    var d = new Date();
    this.nowyear = d.getFullYear();

    //get lectures
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CoursePage');
    this.storage.get('userid').then((data) => {
      this.userid = data;
      this.loadcouring();
    });

  }

  submitratecourse(){
    console.log(this.ratingcourse,this.ratingexam, this.ratingknow, this.ratinglearn);
    if(this.ratingcourse == null || this.ratingexam == null || this.ratingknow== null || this.ratinglearn== null){
      this.showToast('middle', 'Please finish all questions');
    }else{
      var link  = 'http://ratingstudy.ddns.net/ratingstudy/ratecourse.php/.json?ccode='+this.ccode+'&crate='+this.ratingcourse+'&lrate='+this.ratinglearn+'&erate='+this.ratingexam+'&krate='+this.ratingknow+'&aid='+this.userid;
    //console.log(link);
    this.http.get(link).map(res => res.json()).subscribe(
      data => {
        if (data.success==false){
          this.showToast('middle', 'Submit fail, please try again');
          //this.ratingcourse = this.ratingexam = this.ratingknow= this.ratinglearn = 4;
        }else{
          this.showToast('middle', 'Submit Successfull');
          this.ratingcourse = this.ratingexam = this.ratingknow= this.ratinglearn = null;
          this.getrate=false;
          this.loadrating();
        }
       },
      err => {
        console.log("Oops! submit ratecourse.php error");
      });
    }

  }

  submitratecomment(){
    var nousername=this.username;
    if(this.anonymous){
      //nousername = nousername.replace(nousername.substring(1,nousername.length-1), "*".repeat(nousername.length-2));
      nousername = "Anonymous_" +  nousername.substring(0,1) + nousername.substring(nousername.length-1,nousername.length)
    }
    var link  = 'http://ratingstudy.ddns.net/ratingstudy/comment.php/.json?ccode='+this.ccode+'&cm='+this.commentcourse+'&aid='+this.userid+'&username='+nousername+'&useryear='+this.useryear;
    console.log(link);
    this.http.get(link).map(res => res.json()).subscribe(
      data => {
        if (data.success==false){
          this.showToast('middle', 'Comment fail, please try again ');
          this.commentcourse=null;
        }else{
          this.showToast('middle', 'Comment Successfull');
          this.commentcourse=null;
          this.loadcomment();
        }
       },
      err => {
        console.log("Oops! submit comment.php error");
      });
  }

  tolecturepage(pid){
    console.log("tolecturepage pid "+pid);
    this.navCtrl.push(LecturePage,{
      pid : pid
    });
  }

  toratingpage(pid, pname){
    console.log("toratingpage pid "+pid);
    this.navCtrl.push(RatingPage,{
      pid : pid,
      pname : pname,
      ccode : this.ccode,
      cname : this.acourse[0].cname,
      cschool : this.acourse[0].cschool,
      cdesp : this.acourse[0].cdesp
    });
  }


  toupdatecanvas() {
    console.log("times "+this.time  );
    /*if(this.time!=0){
      this.barCanvas.nativeElement.reset();
      console.log("barChart reset");
    }*/

    this.barChart =new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
          labels: ["Overall","Learning", "Exam", "Content"],
          datasets: [{
              label: this.nowyear,
              data: [this.courserate, this.learningrate, this.examrate, this.knowlagerate],
              backgroundColor: [
                  //'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(54, 162, 235, 0.2)'
                  //'rgba(255, 206, 86, 0.2)',
                  //'rgba(75, 192, 192, 0.2)'

              ],
              borderColor: [
                  //'rgba(255,99,132,1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(54, 162, 235, 1)'
                  //'rgba(255, 206, 86, 1)',
                  //'rgba(75, 192, 192, 1)'
              ],
              borderWidth: 1
          },{
            label: this.nowyear-1,
            data: this.pastratedata,
            backgroundColor: [
              'rgba(75, 192, 192, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(75, 192, 192, 0.2)'
            ],
            borderColor: [
              'rgba(75, 192, 192, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(75, 192, 192, 1)',
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
    this.time += 1;
  }

  loadcouring(){
    this.http.get('http://ratingstudy.ddns.net/ratingstudy/course.php/.json?ccode='+this.ccode+'&aid='+this.userid).map(res => res.json()).subscribe(
      data => {
          this.acourse = data.data;
          this.subscribe = this.acourse[0].sub;
          if(data.data2[0]!=null){
            this.ratingcourse = data.data2[0].crate;
            this.ratinglearn = data.data2[0].lrate;
            this.ratingexam = data.data2[0].erate;
            this.ratingknow = data.data2[0].krate;
            this.resubmitdate = data.data2[0].date;
          }


          this.http.get('http://ratingstudy.ddns.net/ratingstudy/lecture.php/.json?ccode='+this.ccode).map(res => res.json()).subscribe(
          data => {
            if(data.data[0]=="null"){
              //this.lectures.pid =
              this.lectures = [{'pid': 0, 'pname':'No Presistance'}];
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

  loadrating(){
    this.http.get('http://ratingstudy.ddns.net/ratingstudy/ratecourse.php/.json?ccode='+this.ccode).map(res => res.json()).subscribe(
      data => {
        if(data.data[0].crate==0 || !data.data[0].crate || data.data[0].crate==null){
          this.courserate = 'No rate';
        }else{
          this.courserate = data.data[0].crate;
        }
        this.pastrate = data.data2[0];
        this.pastratedata = [this.pastrate.crate, this.pastrate.lrate, this.pastrate.erate, this.pastrate.krate];
        this.pastvotenum = data.data2[0].votenum;


        this.learningrate = data.data[0].lrate;
        this.examrate = data.data[0].erate;
        this.knowlagerate = data.data[0].krate;

        this.numofvotes=data.data[0].votenum;
        this.barChart=null;
        this.toupdatecanvas();

      },
      err => {
        console.log("Oops! Get ratecourse.php error");
      });
  }

  loadcomment(){
    this.http.get('http://ratingstudy.ddns.net/ratingstudy/comment.php/.json?ccode='+this.ccode+'&limit='+this.limit).map(res => res.json()).subscribe(
      data => {
          this.comments = data.data;
      },
      err => {
          console.log("Oops! Get comment.php error");
      });
  }

  buttongroup(selection){
    var results=[];
    for (var i=1; i<=5; i++){
      if(i == selection){
        results.push(["select",i]);
      }else{
        results.push(["noselect",i]);
      }
    }
    return results;
  }

  sub(){
    this.http.get('http://ratingstudy.ddns.net/ratingstudy/course.php/.json?ccode='+this.ccode+'&aid='+this.userid+'&sub=1').map(res => res.json()).subscribe(
      data => {
          if(data.success){
            this.showToast('middle', 'Subscribe '+this.ccode+' Successfull!');
            this.subscribe=true;
          } else{
            this.showToast('middle', 'Subscribe '+this.ccode+' Fail!');
          }
      },
      err => {
          console.log("Oops! Get comment.php error");
      });
  }

  deletecomment(comid){
    this.http.get('http://ratingstudy.ddns.net/ratingstudy/comment.php/.json?comid='+comid+'&aid='+this.userid).map(res => res.json()).subscribe(
      data => {
          if(data.success){
            this.showToast('middle', 'Delete comment #'+comid+' Successfull!');
            this.loadcomment();
          } else{
            this.showToast('middle', 'Delete comment #'+comid+' Fail!');
          }
      },
      err => {
          console.log("Oops! Get comment.php error");
      });
  }

  wantgetrate(){
    if(this.getrate){
      this.getrate=false;
    }else{
      this.getrate=true;
    }
  }

  showmorecomment(){
    if(this.comments.length<this.limit){
      this.showToast('middle','No more comment');
    }else{
      this.limit+=10;
      this.loadcomment();
    }
  }

  shortcomment(data){
    var maxLength = 50;
    if (data.length > maxLength) {
      data = data.substr(0,maxLength) + '...';
    }
    return data;
  }

  openModal(msg) {
    console.log(msg);
    let modal = this.modalCtrl.create(CourseRatingPage, {'msg':msg, "parentPage": this});
    modal.present();
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
    this.loadcouring();
    this.loadcomment();
    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

}

@Component({
  template:  `
  <ion-header>
    <ion-toolbar>
      <ion-title>
        Comment
      </ion-title>
      <ion-buttons start>
        <button ion-button (click)="dismiss()">
          <span ion-text color="primary" showWhen="ios">Cancel</span>
          <ion-icon name="md-close" showWhen="android, windows"></ion-icon>
        </button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content padding>
      <h2>{{msg.username}}</h2>
      <p style="color:green;">{{msg.rank}} People Push</p>
      <ion-note>{{msg.date}}<br>#{{msg.comid}}<br></ion-note>
      <p>{{msg.cm}}</p>
      <button ion-button color="light" color="secondary" (click)="pushcomment(msg.comid)">Push</button>
  </ion-content>
  `,
})
export class CourseRatingPage {
  msg={};
  userid = '';
  constructor(
    public platform: Platform,
    public params: NavParams,
    public http: Http,
    public toastCtrl: ToastController,
    private storage: Storage,
    public viewCtrl: ViewController
  ) {
    //this.msg = this.params.get('msg');
    this.msg = params.data.msg;
    console.log(params.data.msg);
    storage.get('userid').then((data) => {this.userid = data;});
  }

  pushcomment(comid){
    var link = 'http://ratingstudy.ddns.net/ratingstudy/ranking.php/.json?action=1&comid='+comid+'&aid='+this.userid;
    console.log(link);
    this.http.get(link).map(res => res.json()).subscribe(
      data => {
          if(data.success){
            this.showToast('middle', 'Push comment #'+comid+' Successfull!');
            this.params.get("parentPage").loadcomment();
            this.viewCtrl.dismiss();
          }else{
            this.showToast('middle', 'Pushed!');
            this.viewCtrl.dismiss();
          }
      },
      err => {
          console.log("Oops! Get ranking.php error");
          this.showToast('middle', 'Push comment fail!');
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

  dismiss() {
    this.viewCtrl.dismiss();
  }
}


