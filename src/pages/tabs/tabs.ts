import { Component } from '@angular/core';

import { SearchPage } from '../search/search';
import { AboutPage } from '../about/about';
import { UserPage } from '../user/user';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = SearchPage;
  tab3Root = ContactPage;
  tab4Root = UserPage;
  constructor() {

  }
}
