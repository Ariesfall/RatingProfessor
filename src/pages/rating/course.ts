import { Component, ViewChild } from '@angular/core';
import { AuthService } from '../../providers/auth-service/auth-service';
import { ViewController, ModalController, ToastController, Platform, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { Chart } from 'chart.js';
import { LecturePage } from '../../pages/rating/lecture';
import { RatingPage } from '../../pages/rating/rating';

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
  subscribe:boolean=false;

  getrate:boolean=false;
  anonymous:boolean=false;

  ratingcourse:number;
  ratinglearn:number;
  ratingexam:number;
  ratingknow:number;
  limit:number = 5;

  courserate:any;
  learningrate:number = 0;
  examrate:number = 0;
  knowlagerate:number = 0;
  numofvotes;
  userid = '';
  username = '';
  useryear;

  

  comments:any;
  commentcourse: String;

  defultrate: string = 'open_rate';
  isAndroid: boolean = false;

  constructor( 
    public modalCtrl: ModalController,
    public toastCtrl: ToastController, 
    platform: Platform, 
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public http: Http, 
    private auth: AuthService
  ) {
    this.ccode = this.navParams.get('ccode');
    let info = this.auth.getUserInfo();
    this.userid = info['userid'];
    this.username = info['username'];
    this.useryear = info['year'];
    this.isAndroid = platform.is('android');
    console.log(this.ccode);
    
    //get lectures
  }

  /*openModal() {

    let modal = this.modalCtrl.create(CourseRatingPage,{ccode:"'+this.ccode+'"});
    modal.present();
  }*/

  ionViewDidLoad() {
    console.log('ionViewDidLoad CoursePage');
      this.loadcouring();      
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
    console.log("tolecturepage pid "+pid);
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
    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
          labels: ["Overall","Learning", "Exam", "Content"],
          datasets: [{
              label: this.numofvotes+' average score',
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

  loadcouring(){
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
        this.numofvotes=data.data[0].votenum;
        this.barChart=null;
        this.toupdatecanvas();
        //this.barChart.update();
        
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
    this.http.get('http://ratingstudy.ddns.net/ratingstudy/course.php/.json?ccode='+this.ccode+'&aid='+this.userid).map(res => res.json()).subscribe(
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
  template: 'courserating.html',
})
export class CourseRatingPage {
  character;
  ccode;
  ratingcourse:number = 4;
  ratinglearn:number = 4;
  ratingexam:number = 4;
  ratingknow:number = 4;

  constructor(
    public platform: Platform,
    public params: NavParams,
    public http: Http, 
    public toastCtrl: ToastController, 
    public viewCtrl: ViewController
  ) {
    this.ccode = this.params.get('ccode');
    //this.character = this.params.get('charNum');
  }

  /*submitratecourse(){
    var link  = 'http://ratingstudy.ddns.net/ratingstudy/ratecourse.php/.json?ccode='+this.ccode+'&crate='+this.ratingcourse+'&lrate='+this.ratinglearn+'&erate='+this.ratingexam+'&krate='+this.ratingknow+'&aid='+this.userid;
    //console.log(link);
    this.http.get(link).map(res => res.json()).subscribe(
      data => {
        if (data.success==false){
          this.showToast('middle', 'Rate fail, please try again ');
        }else{
          this.showToast('middle', 'Rate Successfull'); 
          this.ratingcourse = this.ratingexam = this.ratingknow= this.ratinglearn = 4;
          
        }
       },
      err => {
        console.log("Oops! submit ratecourse.php error");
      });
  }

  showToast(position: string, Msg: string) {
    let toast = this.toastCtrl.create({
      message: Msg,
      duration: 1000,
      position: position
    });

    toast.present(toast);
  }*/
  

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
