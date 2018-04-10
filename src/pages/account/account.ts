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
  templateUrl: 'account.html',
})
export class AccountPage {
  userid = '';
  email = '';
  username = '';
  dbdata = { email :'', username : '', school: '', year: '', accesslv: '', collage: '', major : '', type: ''};
  newdata = this.dbdata;
  inputpassword = {oldpw: '', newpw: '', cfpw: ''};
  editmode = 0;

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
    storage.get('username').then((data) => {this.username = data;});
    storage.get('email').then((data) => {this.email = data;});
    storage.get('userid').then((data) => {
      this.userid = data;
      this.loadpersional();
    });
    storage.get('major').then((data) => {this.dbdata.major = data;});
    storage.get('collage').then((data) => {this.dbdata.collage = data;});
    
    
  }

  public loadpersional(){
    var auth = this.url+"account.php/.json?email="+this.email+"&aid="+this.userid+"&get=1";
    this.http.get(auth).map(res => res.json()).subscribe(
      data => {
        console.log(data);
        this.dbdata.email = data.data[0].email;
        this.dbdata.username = data.data[0].username;
        this.dbdata.school = data.data[0].school;
        this.dbdata.year = data.data[0].year;
        this.dbdata.accesslv = data.data[0].accesslv;

        if(this.dbdata.accesslv == '2'){
          this.dbdata.type = 'Student';
        }else if(this.dbdata.accesslv == '1'){
          this.dbdata.type = 'Lecture';
        }else if(this.dbdata.accesslv == '0'){
          this.dbdata.type = 'Admin';
        }else{
          this.dbdata.type = 'Warmming';
        }
        
        this.storage.set('email', this.dbdata.email);
        this.storage.set('username', this.dbdata.username);
        this.storage.set('school', this.dbdata.school);
        this.storage.set('year', this.dbdata.year);
        this.storage.set('accesslv', this.dbdata.accesslv);
      },
      err => {
          console.log("Oops! Get account.php error");
      });
  }

  editpersonal(num){
    this.editmode = num;
    console.log("edit mode to " + num);
  }

  submitpersonal(){
    var dosql=1;
    this.editmode = 0;
    this.storage.set('major', this.newdata.major);
    this.storage.set('collage', this.newdata.collage);
    /*if(this.newdata.username != this.dbdata.username && this.newdata.year != this.dbdata.year){
      var auth = this.url+"account.php/.json?edit=2&email="+this.email+"&aid="+this.userid+"&year="+this.newdata.year+"&username="+this.newdata.username;
    }else if(this.newdata.username != this.dbdata.username){
      var auth = this.url+"account.php/.json?edit=1&email="+this.email+"&aid="+this.userid+"&username="+this.newdata.username;
    }else if(this.newdata.year != this.dbdata.year){
      var auth = this.url+"account.php/.json?edit=0&email="+this.email+"&aid="+this.userid+"&year="+this.newdata.year;
    }else{
      dosql = 0;
    }*/
    var auth = this.url+"account.php/.json?edit=0&email="+this.email+"&aid="+this.userid+"&year="+this.newdata.year+"&username="+this.newdata.username;
    if(dosql==1){
      console.log(auth);
      this.http.get(auth).map(res => res.json()).subscribe(
        data => {
          console.log(data);
          if (data.access == 200){
            this.showPopup("Success", "Information changed");
            this.loadpersional();
          }else{
            this.showPopup("Error", "Username has been use");
          }
        },
        err => {
            console.log("Oops! Get account.php error");
        });
    }
    console.log("edit mode off");
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccountPage');
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

}

