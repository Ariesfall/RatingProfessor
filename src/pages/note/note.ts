import { Component } from '@angular/core';
import { ModalController, Platform, NavParams, ViewController, NavController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { Http } from '@angular/http';
import { CoursePage } from '../../pages/rating/course';
import { LecturePage } from '../../pages/rating/lecture';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-note',
  templateUrl: 'note.html'
})
export class NotePage {
  posts: any;
  username = '';
  email = '';
  userid ='';
  courseranking:any;
  coursestar:any=[];
  lectureranking:any;
  lecturestar:any=[];

  constructor(public navCtrl: NavController, public http: Http, private nav: NavController, private auth: AuthService, private storage: Storage) {
    this.togetranking();
    let info = this.auth.getUserInfo();
    //this.username = info['name'];
    //this.email = info['email'];
    storage.get('userid').then((data) => {this.userid = data;});
    storage.get('email').then((data) => {this.email = data;});
    storage.get('username').then((data) => {this.username = data;});
  }

  ionViewDidLoad() {
  }

  togetranking(){
    this.http.get('http://ratingstudy.ddns.net/ratingstudy/ranking.php/.json?limit=1&aid='+this.userid).map(res => res.json()).subscribe(
      data => {
          this.courseranking = data.data;
          for(var i = 0;i<this.courseranking.length;i++){
            var star = 0;
            var halfstar = 0;
            var avg = this.courseranking[i].cavg;
            var starnum = [];
            star = Math.floor(this.courseranking[i].cavg);
            starnum = Array(star).fill(0).map((x,i)=>i);

            if(avg - star >= 0.5){
              halfstar = 1;
            }

            console.log(halfstar);
            var object = {'star':starnum,'half':halfstar}
            this.coursestar.push(object);
          }
          this.lectureranking = data.subdata;
          for(i = 0;i<this.lectureranking.length;i++){
            var star2 = 0;
            var halfstar2 = 0;
            var starnum2 = [];
            star2 = Math.floor(this.lectureranking[i].pavg);
            starnum2 = Array(star2).fill(0).map((x,i)=>i);

            if(avg - star >= 0.5){
              halfstar2 = 1;
            }
            var object2 = {'star':starnum2,'half':halfstar2}
            this.lecturestar.push(object2);
          }
      },
      err => {
          console.log("Oops!get course error");
      });
  }

  tolecturepage(pid){
    console.log("tolecturepage pid "+pid);
    this.navCtrl.push(LecturePage,{
      pid : pid
    });
  }

  tocoursepage(ccode){
    this.navCtrl.push(CoursePage,{
      ccode : ccode
    });
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    this.togetranking();
    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

}
