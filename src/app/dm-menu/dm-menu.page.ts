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
  //username: string = '';
  constructor(public router: Router, public service: Service) {
    this.ref.on('value', resp => {
      this.chats = [];
      this.chats = snapshotToArray(resp);
    });
  }
 
  ngOnInit() {
    var currentUser = firebase.auth().currentUser;
    var self = this;
    let user;
    if (this.service.loggedIn()) {
      self.service.db.collection("username").doc(currentUser.uid).get().then(username => {
        user=username.data().username;
      });
      this.service.db.collection("username").doc(currentUser.uid).collection("conversations").onSnapshot(conversationList => {
        self.chats = [];
        conversationList.forEach(doc => {
          console.log("here");
          let conversation = doc.data();
          console.log(user);
          if(conversation.UserA==user){
            self.chats.push({username:conversation.UserB});
          }
          else{
            self.chats.push({username:conversation.UserA});
          }
        })
        this.chats = self.chats;
        console.log(this.chats);
      })
    }
  }

  loadUsername(uid) {
    //var currentUser = firebase.auth().currentUser;
    let rUsername = '';
    if (this.service.loggedIn()) {
      this.service.db.collection("username").doc(uid).get().then(doc => {
        rUsername = doc.data().username;
      });
    }
    return rUsername;
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
