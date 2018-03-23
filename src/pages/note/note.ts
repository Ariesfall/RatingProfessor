import { Component } from '@angular/core';
import { ModalController, Platform, NavParams, ViewController, NavController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { Http } from '@angular/http';
import { LoginPage } from '../../pages/login/login';
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

  constructor(public navCtrl: NavController, public http: Http, private nav: NavController, private auth: AuthService, private storage: Storage) {
    let info = this.auth.getUserInfo();
    //this.username = info['name'];
    //this.email = info['email'];
    storage.get('userid').then((data) => {this.userid = data;});
    storage.get('email').then((data) => {this.email = data;});
    storage.get('username').then((data) => {this.username = data;});
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
      this.nav.setRoot(LoginPage)
    });
    //this.navCtrl.pop(LoginPage);
  }
}
