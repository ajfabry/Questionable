import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import * as firebase from 'firebase';

var firebaseConfig = {
  apiKey: "AIzaSyDEIpKmhyqkXRfq5KYG0NW-NW5oJo7E614",
  authDomain: "questionable-84077.firebaseapp.com",
  databaseURL: "https://questionable-84077.firebaseio.com",
  projectId: "questionable-84077",
  storageBucket: "questionable-84077.appspot.com",
  messagingSenderId: "564967703516",
  appId: "1:564967703516:web:b4b376d140d548bf994519",
  measurementId: "G-33BXJTJ26H"
};

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {


  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      firebase.initializeApp(firebaseConfig);
    });
  }
}
