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
  user = '';
  ref = firebase.database().ref('chats/');
  //username: string = '';
  constructor(public router: Router, public service: Service) {
    // this.ref.on('value', resp => {
    //   this.chats = [];
    //   this.chats = snapshotToArray(resp);
    // });
  }
 
  ngOnInit() {
    
    var currentUser = firebase.auth().currentUser;
    var self = this;
    //debugger
    if (this.service.loggedIn()) {
      //console.log("logged in as " + this.user);
      //debugger
      this.service.db.collection("username").doc(currentUser.uid).get().then(username => {
        this.user=username.data().username;
        console.log("logged in as " + this.user);
        this.service.db.collection("username").doc(currentUser.uid).collection("conversations").onSnapshot(conversationList => {
          self.chats = [];
          conversationList.forEach(doc => {
            let conversation = doc.data();
            if(conversation.UserA==this.user){
              self.chats.push({username:conversation.UserB,pChatName:conversation.roomName});
            }
            else{
              self.chats.push({username:conversation.UserA,pChatName:conversation.roomName});
            }
          })
          this.chats = self.chats;
          //this.user = self.user;
          //console.log(this.chats);
        })
      });
      
    }
  }

  refreshQuestions(event) {
    this.ngOnInit();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
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

// export const snapshotToArray = snapshot => {
//   let returnArr = [];

//   snapshot.forEach(childSnapshot => {
//       let item = childSnapshot.val();
//       item.key = childSnapshot.key;
//       returnArr.push(item);
//   });

//   return returnArr;
// };
