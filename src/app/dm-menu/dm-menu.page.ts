import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'Firebase';


@Component({
  selector: 'app-dm-menu',
  templateUrl: './dm-menu.page.html',
  styleUrls: ['./dm-menu.page.scss'],
})
export class DmMenuPage implements OnInit {

  chats = [];
  ref = firebase.database().ref('dmMenu/');

  constructor(public router: Router) {
    this.ref.on('value', resp => {
      this.chats = [];
      this.chats = snapshotToArray(resp);
    });
  }

  ngOnInit() {
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
