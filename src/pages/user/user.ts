import { Component } from '@angular/core';
import { App, ModalController, Platform, NavParams, ViewController, NavController, AlertController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { Http } from '@angular/http';
import { LoginPage } from '../../pages/login/login';
import { AccountPage } from '../../pages/account/account';
import { Storage } from '@ionic/storage';

import 'rxjs/add/operator/map';

@Component({
  selector: 'page-user',
  templateUrl: 'user.html'
})
export class UserPage {
  posts: any;
  username = '';
  email = '';
  userid ='';
  version = 'test0.01';
  
  constructor(
    public app:App, 
    public navCtrl: NavController, 
    public http: Http, 
    public platform: Platform, 
    private nav: NavController, 
    private alertCtrl: AlertController, 
    private auth: AuthService,
    private storage: Storage
  ) {
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

  contectus(){
    let prompt = this.alertCtrl.create({
      title: 'Contect Us',
      message: "Contect us with email <a herf='mailto:panduola1995@gmail.com'>panduola1995@gmail.com</a> <br>Or click Feedback button",
      buttons: [
        {
          text: 'Feedback',
          handler: () => {
            this.mailto();
            console.log('Feedback clicked');
          }
        },
        {
          text: 'Close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    prompt.present();
  }

  mailto() {
    var platform = this.platform.platforms();
    var platver = JSON.stringify(this.platform.versions());
    var lang = this.platform.lang();
    setTimeout(()=>{
       window.open('mailto:panduola1995@gmail.com?subject=Feedback - RatingSystem&body=AppsVersion: '+this.version+'; Platform: '+platform+'; PlatfVersion: '+platver+'; Language: '+lang+' ');
    },500);
  }

  about(){
    let alert = this.alertCtrl.create({
      title: 'About',
      subTitle: "Version: "+this.version+" <br>Develope: Kit Playgroup",
      buttons: ['Close']
    });
    alert.present();
  }
  chpw(){

  }

  personal(){
    this.navCtrl.push(AccountPage,{ });
  }

  public logout() {
    this.auth.logout().subscribe(succ => {
      this.storage.set('rootPage', "LoginPage");
      this.app.getRootNav().setRoot(LoginPage);
    });
    //this.navCtrl.pop(LoginPage);
  }
}
