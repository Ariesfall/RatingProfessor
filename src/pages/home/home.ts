import { Component } from '@angular/core';
import { NavController,NavParams, ToastController, AlertController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map'; 
import { CoursePage } from '../../pages/rating/course';

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
  subscribe:boolean=false;

  constructor(
    public navCtrl: NavController, 
    public http: Http, 
    public toastCtrl: ToastController, 
    private alertCtrl: AlertController, 
    private nav: NavController, 
    private auth: AuthService) {

      let info = this.auth.getUserInfo();
      this.userid = info['userid'];
      this.email = info['email'];
      this.username = info['username'];
      

    /*this.courseRef.on('value', courseList => {//db
      let countries = [];
      courseList.forEach( course => {
        countries.push(course.val());
        return false;
      });
    
      this.courseList = countries;
      this.loadedCourseList = countries;
    });
  
    initializeItems(): void {//db
      this.courseList = this.loadedCourseList;
    }
    getItems(searchbar) {//db
      // Reset items back to all of the items
      this.initializeItems();
      // set q to the value of the searchbar
      var q = searchbar.srcElement.value;
    
    
      // if the value is an empty string don't filter the items
      if (!q) {
        return;
      }
    
      this.courseList = this.courseList.filter((v) => {
        if(v.name && q) {
          if (v.name.toLowerCase().indexOf(q.toLowerCase()) > -1) {
            return true;
          }
          return false;
        }
      });
    
      console.log(q, this.courseList.length);
    
    }*/
    
  }

  ionViewDidLoad(){
    this.togetcourse();
  }

  togetcourse(){
    this.http.get('http://ratingstudy.ddns.net/ratingstudy/course.php/.json?limit=1').map(res => res.json()).subscribe(
      data => {
          this.courses = data.data;
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

  sub(ccode){
    this.http.get('http://ratingstudy.ddns.net/ratingstudy/course.php/.json?ccode='+ccode+'&aid='+this.userid).map(res => res.json()).subscribe(
      data => {
          if(data.success){
            this.showToast('middle', 'Subscribe '+ccode+' Successfull!'); 
            this.subscribe=true;
          } else{
            this.showToast('middle', 'Subscribe '+ccode+' Fail!'); 
          }
      },
      err => {
          console.log("Oops! Get comment.php error");
      });
  }
  
  Unsub(ccode){
    this.http.get('http://ratingstudy.ddns.net/ratingstudy/course.php/.json?ccode='+ccode+'&aid='+this.userid).map(res => res.json()).subscribe(
      data => {
          if(data.success){
            this.showToast('middle', 'Unsubscribe '+ccode+' Successfull!'); 
            this.subscribe=true;
          } else{
            this.showToast('middle', 'Unsubscribe '+ccode+' Fail!'); 
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

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    this.togetcourse();
    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }


}
