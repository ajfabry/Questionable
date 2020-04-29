import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'Firebase';
import { Service } from '../question.service';

@Component({
  selector: 'app-dm-menu',
  templateUrl: './dm-menu.page.html',
  styleUrls: ['./dm-menu.page.scss'],
})
export class DmMenuPage implements OnInit {

  chats = [];
  ref = firebase.database().ref('chats/');
  username: string = '';

  constructor(public router: Router, public service: Service) {
    this.ref.on('value', resp => {
      this.chats = [];
      this.chats = snapshotToArray(resp);
    });
  }
 
  ngOnInit() {
  }

  loadUsername() {
    var currentUser = firebase.auth().currentUser;

    if (this.service.loggedIn()) {
      this.service.db.collection("username").doc(currentUser.uid).get().then(doc => {
        this.username = doc.data().username;
      });
    }
  }
  
  goToChat(chat) {
    this.router.navigate(["/dm-user", chat]);
  }
}

export const snapshotToArray = snapshot => {
  let returnArr = [];

  snapshot.forEach(childSnapshot => {
      let item = childSnapshot.val();
      item.key = childSnapshot.key;
      returnArr.push(item);
  });

  return returnArr;
};
