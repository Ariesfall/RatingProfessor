import { Component } from '@angular/core';
import { NavController,NavParams, AlertController } from 'ionic-angular';
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
  courses: any;
  subscribe:boolean=false;

  constructor(public navCtrl: NavController, public http: Http, private alertCtrl: AlertController, private nav: NavController, private auth: AuthService) {
    let info = this.auth.getUserInfo();
    this.userid = info['userid'];
    this.email = info['email'];
    

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

  enroll(ccode){
    let alert = this.alertCtrl.create({
      title: 'Subscribe '+ccode,
      inputs: [
        {
          name: 'Lecturer',
          placeholder: 'Lecturer name'
        },
        {
          name: 'exp date',
          placeholder: '',
          type: 'date'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Subscribe',
          handler: data => {
            this.subscribe=true;
          }
        }
      ]
    });
    alert.present();
  }

  deenroll(ccode){
    this.subscribe=false;
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
