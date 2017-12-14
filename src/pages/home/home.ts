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
  public courseList:Array<any>;
  public loadedCourseList:Array<any>;
  public courseRef;
  
  //public items : any = [];
  username = '';
  email = '';

  constructor(public navCtrl: NavController, public http: Http, private nav: NavController, private auth: AuthService) {
    let info = this.auth.getUserInfo();
    this.username = info['name'];
    this.email = info['email'];

    /*this.courseRef.on('value', courseList => {//db
      let countries = [];
      courseList.forEach( course => {
        countries.push(course.val());
        return false;
      });
    
      this.courseList = countries;
      this.loadedCourseList = countries;
    });
  
    initializeItems(): void {//db
      this.courseList = this.loadedCourseList;
    }
    getItems(searchbar) {//db
      // Reset items back to all of the items
      this.initializeItems();
      // set q to the value of the searchbar
      var q = searchbar.srcElement.value;
    
    
      // if the value is an empty string don't filter the items
      if (!q) {
        return;
      }
    
      this.courseList = this.courseList.filter((v) => {
        if(v.name && q) {
          if (v.name.toLowerCase().indexOf(q.toLowerCase()) > -1) {
            return true;
          }
          return false;
        }
      });
    
      console.log(q, this.courseList.length);
    
    }*/
  }
  
  
  

}
