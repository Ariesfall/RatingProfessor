import { Component } from '@angular/core';
import { AuthService } from '../../providers/auth-service/auth-service';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map'; 

@Component({
  selector: 'page-rating',
  templateUrl: 'rating.html',
})
export class RatingPage {
  acourse:any;
  ccode:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, private nav: NavController, private auth: AuthService) {
    this.ccode = this.navParams.get('ccode');
    console.log(this.ccode);
    this.http.get('http://ratingstudy.ddns.net/ratingstudy/course.php/.json?ccode="'+this.ccode+'"').map(res => res.json()).subscribe(
      data => {
          this.acourse = data.data;
      },
      err => {
          console.log("Oops!");
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RatingPage');
  }

}
