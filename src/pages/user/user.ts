import { Component } from '@angular/core';
import { App, ModalController, Platform, NavParams, ViewController, NavController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { Http } from '@angular/http';
import { LoginPage } from '../../pages/login/login';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-user',
  templateUrl: 'user.html'
})
export class UserPage {
  posts: any;
  username = '';
  email = '';
  constructor(public app:App, public navCtrl: NavController, public http: Http, private nav: NavController, private auth: AuthService) {
    let info = this.auth.getUserInfo();
    this.username = info['name'];
    this.email = info['email'];
  }

  ionViewDidLoad() {
    /*this.http.get('http://ratingstudy.ddns.net/ratingstudy/json.php/.json').map(res => res.json()).subscribe(
    data => {
        this.posts = data.data;
    },
    err => {
        console.log("Oops!");
    });*/
  }

  public logout() {
    this.auth.logout().subscribe(succ => {
      this.app.getRootNav().setRoot(LoginPage);
    });
    //this.navCtrl.pop(LoginPage);
  }
}
