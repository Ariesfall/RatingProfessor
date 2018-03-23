import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Network } from '@ionic-native/network';
import { Storage } from '@ionic/storage';
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
    storage.get('username').then((data) => {this.username = data;});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccountPage');
  }

}
