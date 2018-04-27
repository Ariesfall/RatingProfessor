import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Loading, ToastController } from 'ionic-angular';
import { Http } from '@angular/http';
import { AuthService } from '../../providers/auth-service/auth-service';
import { RegisterPage } from '../../pages/register/register';
import { TabsPage } from '../../pages/tabs/tabs';
import { Network } from '@ionic-native/network';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  loading: Loading;
  registerCredentials = { email: '', password: '' };

  constructor(
    private nav: NavController,
    private auth: AuthService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private network: Network,
    private toast: ToastController,
    private storage: Storage,
    public http: Http) {

      storage.get('loginstatus').then((data) => {
        console.log('Login status is ', data);
        if(data){
          this.nav.setRoot(TabsPage);
        }
      });

   }

  ionViewDidLoad(){

  }

   public createAccount() {
     this.nav.push(RegisterPage);
   }

  public login() {
    /*if(!this.isConnected()){
      this.showLoading('Wating connect to network...');
    }else{*/
    this.showLoading('Please wait...')
    this.auth.login(this.registerCredentials).subscribe(allowed => {
      if (allowed==0) {
        this.storage.set('rootPage', 'TabsPage');
        this.loading.dismiss();
        this.nav.setRoot(TabsPage);
      } else if(allowed==1){
        this.showError("Error","Email or password incorrect");
      } else if(allowed==99){
        this.showError("Error","Account not verified, please check your email!");
      } else {
        this.showError("Error","Access not accept");
      }
    },
      error => {
        this.showError("Error",error);
      });
  //}
  }

  showLoading(msgss:string) {
    this.loading = this.loadingCtrl.create({
      content: msgss,
      dismissOnPageChange: false
    });
    this.loading.present();
  }

  showError(title, text) {
    this.loading.dismiss();
    if(title == null){title = 'Error'}
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: ['OK']
    });

    alert.present();
    //alert.present(prompt);
  }

  forgetpwsendemail() {
    let prompt = this.alertCtrl.create({
      title: 'Forget Password',
      message: "Enter your email address, the reset link will send",
      inputs: [
        {
          name: 'email',
          placeholder: 'Email'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Send',
          handler: data => {
            console.log('Send clicked');
            this.forgetpw(data.email);
          }
        }
      ]
    });
    prompt.present();
  }

  forgetpw(email){
    this.showLoading('Please wating...');
    console.log("fpw, send email to "+email);
    this.http.get('http://ratingstudy.ddns.net/ratingstudy/register.php/.json?email='+email+'&resetpassword=1').map(res => res.json()).subscribe(
      data => {
        if(data.success){
          this.showError("Success","Email has sent to <"+email+">");
        }else{
          this.showError("Error","Email <"+email+"> not found");
        }
      },
      err => {
        console.log("Oops! Get lecture.php error");
      });
  }

  ionViewDidEnter() {
    var loadmsg = 0;

    //not work in website but work in moblie
    if(!this.isConnected()&&loadmsg==0){
      loadmsg = 1;
      this.presentToast('Wating connect to network...');
    }

    this.network.onConnect().subscribe(data => {
      if(loadmsg==1){
        //this.toast.dismiss();
        loadmsg = 0;
      }

      console.log(data)
      this.displayNetworkUpdate(data.type);
    }, error => console.error(error));

    this.network.onDisconnect().subscribe(data => {
      console.log(data)
      this.displayNetworkUpdate(data.type);
      if(loadmsg==0){
        loadmsg = 1;
        //this.showLoading('Wating connect to network...');
        this.presentToast('Wating connect to network...');
      }

    }, error => console.error(error));

   }

  displayNetworkUpdate(connectionState: string){
    let networkType = this.network.type;
    this.toast.create({
      message: `You are now ${connectionState} via ${networkType}`,
      duration: 3000
    }).present();
  }

  isConnected(): boolean {
    let conntype = this.network.type;
    console.log(conntype)
    return conntype && conntype !== 'unknown' && conntype !== 'none';
  }

  presentToast(msg) {
    let toast = this.toast.create({
      message: " !!! "+msg,
      //duration: 8000,
      showCloseButton: true,
      closeButtonText: 'Ok'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

}
