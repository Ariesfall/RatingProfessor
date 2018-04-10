import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import { CoursePage } from '../../pages/rating/course';

@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {
  items: string[];
  searchtype = "basic";
  //adsearch = {ccode : '', 'school':'', title:'', lname:''};
  adsearch_school;
  adsearch_ccode;
  adsearch_title;
  adsearch_lname;
  adsearchbar = 1;
  coursecodes: string[];
  professors;

  constructor(
    public http: Http, 
    private alertCtrl: AlertController, 
    public navCtrl: NavController
  ) {
    this.coursecodes=[];
    this.http.get('http://ratingstudy.ddns.net/ratingstudy/course.php/.json').map(res => res.json()).subscribe(
      data => {
        for (var a_item in data.data) {
          this.coursecodes.push(data.data[a_item].ccode +' '+ data.data[a_item].cname);
        }
      },
      err => {
          console.log("Oops!get course error");
      });
      this.initializeItems();
  }
  
  ionViewDidLoad(){
  }
  
  initializeItems(){
    this.items = this.coursecodes;
  }

  getItems(ev) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the ev target
    var val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  tocoursepage(ccode){
    ccode=ccode.substr(0,ccode.indexOf(' '));
    this.navCtrl.push(CoursePage,{
      ccode : ccode
    });
  }

  tosearch(){
    this.adsearchbar = 0;
    this.showError("Sorry", "The function will comming soon!");
  }
  
  searchbar(){
    this.adsearchbar = 1;
  }

  showError(title, text) {
    if(title == null){title = 'Error'}
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: ['OK']
    });
    
    alert.present();
    //alert.present(prompt);
  }
}
