import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { CoursePage } from '../../pages/rating/course';
import { Network } from '@ionic-native/network';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage{
  public courseList:Array<any>;
  public loadedCourseList:Array<any>;
  public courseRef;

  //public items : any = [];
  userid = '';
  email = '';
  username ='';
  courses: any;
  subscribe: any;
  studentlist: any;

  constructor(
    public navCtrl: NavController,
    public http: Http,
    public toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private nav: NavController,
    private network: Network,
    private storage: Storage,
    private auth: AuthService) {

      let info = this.auth.getUserInfo();
      //this.userid = info['userid'];
      //this.email = info['email'];
      //this.username = info['username'];
      storage.get('userid').then((data) => {this.userid = data;});
      storage.get('email').then((data) => {this.email = data;});
      storage.get('username').then((data) => {this.username = data;});

  }

  ionViewDidLoad(){
    this.storage.get('userid').then((data) => {
      this.userid = data;
      this.togetcourse();
    });

  }

  togetcourse(){
    var url = "http://ratingstudy.ddns.net/ratingstudy/course.php/.json?";
    this.http.get(url+'limit=1&aid='+this.userid).map(res => res.json()).subscribe(
      data => {
          this.courses = data.data;
          this.subscribe = data.subdata;
          this.studentlist = data.data3;
      },
      err => {
          console.log("Oops!get course error");
      });
  }

  tocoursepage(ccode){
    this.navCtrl.push(CoursePage,{
      ccode : ccode
    });
  }

  sub(ccode, msg){
    this.http.get('http://ratingstudy.ddns.net/ratingstudy/course.php/.json?ccode='+ccode+'&aid='+this.userid+'&sub=1').map(res => res.json()).subscribe(
      data => {
          if(data.success){
            this.showToast('middle', msg+' '+ccode+' Successfull!');
            this.togetcourse();
            //this.subscribe=true;
          } else{
            this.showToast('middle', msg+' '+ccode+' Fail!');
          }
      },
      err => {
          console.log("Oops! Get comment.php error");
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

  showError(text) {
    let alert = this.alertCtrl.create({
      title: 'Fail',
      subTitle: text,
      buttons: ['OK']
    });

    alert.present();
    //alert.present(prompt);
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    this.togetcourse();
    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }




}
