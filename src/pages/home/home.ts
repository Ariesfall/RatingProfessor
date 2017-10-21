import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map'; 


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  posts: any;
  //public items : any = [];
  constructor(public navCtrl: NavController, public http: Http) {
    this.http.get('http://34.201.241.97/ratingstudy/json.php').map(res => res.json()).subscribe(
      data => {
          this.posts = data.data.children;
      },
      err => {
          console.log("Oops!");
      }
  );
  console.log(this.posts);
    
  }

  /*getData(){
    this.http.get('assets/data/mydata.json')
    .map((res) => res.json())
    .subscribe(data => {
    this.data = data;
    }, (rej) => {console.error("Could not load local data",rej)});
  }*/


  

  /*ionViewWillEnter()
   {
      this.load();
   }
   // Retrieve the JSON encoded data from the remote server
   // Using Angular's Http class and an Observable - then
   // assign this to the items array for rendering to the HTML template
   load()
   {
      this.http.get('http://ratingstudy.ddns.net/ratingstudy/json.php')
      .map(res => res.json())
      .subscribe(data => 
      {
         this.items = data;         
      });
   }

   // Allow navigation to the AddTechnology page for creating a new entry
   addEntry()
   {
      this.navCtrl.push('AddTechnology');
   }


   // Allow navigation to the AddTechnology page for amending an existing entry
   // (We supply the actual record to be amended, as this method's parameter, 
   // to the AddTechnology page
   viewEntry(param)
   {
      this.navCtrl.push('AddTechnology', param);
   }
*/
}
