import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map'; 


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage{
  //public items : any = [];
  username = '';
  email = '';

  constructor(public navCtrl: NavController, public http: Http, private nav: NavController, private auth: AuthService) {
    let info = this.auth.getUserInfo();
    this.username = info['name'];
    this.email = info['email'];
  }
  
  

}
