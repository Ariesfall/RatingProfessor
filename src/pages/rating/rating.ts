import { Component, ViewChild } from '@angular/core';
import { AuthService } from '../../providers/auth-service/auth-service';
import { ToastController, Platform, IonicPage, NavController, NavParams, PopoverController} from 'ionic-angular';
import { Http } from '@angular/http';
import { Chart } from 'chart.js';
import { LecturePage } from '../../pages/rating/lecture';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map'; 

@Component({
  selector: 'page-rating',
  templateUrl: 'rating.html',
})

export class RatingPage {
  //@ViewChild('barCanvas') barCanvas;
  @ViewChild('radarCanvas') radarCanvas;
  //@ViewChild('lineCanvas') lineCanvas;
  //barChart2: any;
  radarChart: any;
  lineChart: any;
  isAndroid: boolean = false;

  userid = '';
  username = '';
  useryear;
  getfeedback:boolean=false;
  anonymous:boolean=false;

  ccode:string;
  pid:string;
  pname:string;
  cname: string;
  school: string;
  week_num:any;
  submitbtn: string = "Submit";

  lecturesweek:any;
  lecturesweekscore:any;
  lecturescore2:any;
  lecturecm:any;
  lectures:any;

  q1:number;
  q2:number;
  q3:number;
  q4:number;
  q5:number;
  text:string=null;
  limit:number = 5;

  constructor(
    public toastCtrl: ToastController, 
    platform: Platform, 
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public http: Http, 
    public popoverCtrl: PopoverController,
    private storage: Storage,
    private auth: AuthService) {
    this.ccode = this.navParams.get('ccode');
    this.pid = this.navParams.get('pid');
    this.pname = this.navParams.get('pname');
    this.cname = this.navParams.get('cname');
    this.school = this.navParams.get('cschool');
    let info = this.auth.getUserInfo();
    /*this.userid = info['userid'];
    this.username = info['username'];
    this.useryear = info['year'];*/

    storage.get('userid').then((data) => {this.userid = data;});
    storage.get('year').then((data) => {this.useryear = data;});
    storage.get('username').then((data) => {this.username = data;});

    this.isAndroid = platform.is('android');
    console.log(this.ccode,this.pid,this.userid);
  }

  submitratelecture(){
    var nousername=this.username;
    if(this.anonymous){
      //nousername = nousername.replace(nousername.substring(1,nousername.length-1), "*".repeat(nousername.length-2));
      nousername = "Anonymous_" +  nousername.substring(0,1) + nousername.substring(nousername.length-1,nousername.length)
    }
    if(this.q1==null || this.q2==null || this.q3==null || this.q4==null || this.q5==null){
      this.showToast('middle', 'Please finish all questions');
    }else{
      var link  = 'http://ratingstudy.ddns.net/ratingstudy/lecture.php/.json?ccode='+this.ccode
      +'&pid='+this.pid+'&q1='+this.q1+'&q2='+this.q2+'&q3='+this.q3+'&q4='+this.q4+'&q5='+this.q5+'&text='+this.text
      +'&aid='+this.userid+'&username='+nousername+'&useryear='+this.useryear+'&week='+this.week_num;
      console.log(link);
      this.http.get(link).map(res => res.json()).subscribe(
        data => {
          if (data.success==false){
            this.showToast('middle', 'Submit fail, please try again');
            //this.ratingcourse = this.ratingexam = this.ratingknow= this.ratinglearn = 4;
          }else{
            this.showToast('middle', 'Submit Successfull'); 
            this.q1 = this.q2 = this.q3= this.q4 = this.q5 = this.text = null;
            this.getfeedback=false;
            this.loaddataing();
            this.loadfeedback();
          }
         },
        err => {
          console.log("Oops! submit ratecourse.php error");
        });
    }
    
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
    this.storage.get('userid').then((data) => {
      this.userid = data;
      this.loaddataing();
      this.loadfeedback();
    });
    
  }

  loaddataing(){
    this.http.get('http://ratingstudy.ddns.net/ratingstudy/lecture.php/.json?ccode='+this.ccode+'&pid='+this.pid+'&aid='+this.userid+'&school='+this.school).map(res => res.json()).subscribe(
      data => {
        this.lecturesweek=[];
        this.lecturesweekscore=[];
        this.week_num=data.week;
        if(data.errcode=='re002'){
          this.q1 = data.data4[0].q1;
          this.q2 = data.data4[0].q2;
          this.q3 = data.data4[0].q2;
          this.q4 = data.data4[0].q3;
          this.q5 = data.data4[0].q4;
          this.text = data.data4[0].text;
          this.submitbtn = 'Resubmit';
        }
        for(var i in data.data){
          this.lecturesweek.push("week "+data.data[i].week);
          this.lecturesweekscore.push(data.data[i].score);
        }
        console.log(this.lecturesweek);
        this.lecturescore2 = data.data2[0];
        this.toupdatecanvas();
        
      },
      err => {
        console.log("Oops! Get lecture.php error");
      });
  }

  loadfeedback(){
    this.http.get('http://ratingstudy.ddns.net/ratingstudy/lecture.php/.json?ccode='+this.ccode+'&pid='+this.pid+'&limit='+this.limit).map(res => res.json()).subscribe(
      data => {
        this.lecturecm = data.data;
      },
      err => {
        console.log("Oops! Get lecture.php error");
      });
  }

  toupdatecanvas() {
   /* this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: this.lecturesweek,
        datasets: [{
            label: 'week average score',
            data: this.lecturesweekscore,
            backgroundColor: 'rgba(114, 245, 0, 0.2)',
            borderColor:'rgba(18, 173, 42, 1)',
            borderWidth: 1
          }]
      },
      options: {
        scales: {
          yAxes: [{
              ticks: {
                  beginAtZero: false
              }
          }]
        },
        title: {
          display: true,
          text: 'Lecture Score per Week'
        }
      }
    });*/
    
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
            responsive: false,
            maintainAspectRatio: true,
            ticks: {
              // changes here
              max : 5,
              min : 1,
          }
        },
        title: {
          display: true,
          text: 'The lecturer behave of '+this.ccode +' in 5 standards'
        }
      }
    });

    
  }

  wantgetfeedback(){
    if(this.getfeedback){
      this.getfeedback=false;
    }else{
      this.getfeedback=true;
    }
  }

  showmorefeedback(){
    if(this.lecturecm.length<this.limit){
      this.showToast('middle','No more feedback');
    }else{
      this.limit+=10;
      this.loadfeedback();
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
    this.loaddataing();
    this.loadfeedback();
    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

  buttongroup(q_num, selection){
    var results=[];
    for (var i=1; i<=5; i++){
      if(i == selection){
        results.push([q_num+'='+i,"select",i]);
      }else{
        results.push([q_num+'='+i,"noselect",i]);
      }
    }
    return results;
  }

}
