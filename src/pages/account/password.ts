import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Network } from '@ionic-native/network';
import { Storage } from '@ionic/storage';
import { Md5 } from 'ts-md5/dist/md5'
/**
 * Generated class for the AccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-account',
  templateUrl: 'password.html',
})
  export class PasswordPage {
    userid = '';
    email = '';
    username = '';
    inputpassword = {oldpw: '', newpw: '', cfpw: ''};
    url = "http://ratingstudy.ddns.net/ratingstudy/";
  
    constructor(
      public nav: NavController, 
      public navParams: NavParams,
      public http: Http, 
      public toastCtrl: ToastController, 
      private alertCtrl: AlertController, 
      private network: Network, 
      private storage: Storage
    ) {
      storage.get('userid').then((data) => {this.userid = data;});
      storage.get('email').then((data) => {this.email = data;});
    }
  
    public changepassword(){
      if(this.inputpassword.newpw == this.inputpassword.cfpw){
        var oldpw = Md5.hashStr(this.inputpassword.oldpw+this.email).toString();
        var newpw = Md5.hashStr(this.inputpassword.newpw+this.email).toString();
        var auth = this.url+"account.php/.json?email="+this.email+"&aid="+this.userid+"&oldpw="+oldpw+"&newpw="+newpw;
        console.log(auth);
        this.http.get(auth).map(res => res.json()).subscribe(
          data => {
            console.log(data);
            if (data.access == 200){
              this.showPopup("Success", "Your password changed");
            }else if(data.access == 300){
              this.showPopup("Error", "You password incorrect");
            }else{
              this.showPopup("Error", "Please check your password");
            }
          },
          err => {
              console.log("Oops! Get account.php error");
          });
      }else{
        this.showPopup("Error", "Please comfirm you new password");
      }
      
    }
  
    showPopup(title, text) {
      let alert = this.alertCtrl.create({
        title: title,
        subTitle: text,
        buttons: [
          {
            text: 'OK',
            handler: data => {
            }
          }
        ]
      });
      alert.present();
    }
  
    ionViewDidLoad() {
      console.log('ionViewDidLoad AccountPage');
    }
  }