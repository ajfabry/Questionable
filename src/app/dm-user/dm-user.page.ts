import { Component, OnInit } from '@angular/core';
import { ViewChild} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Service } from '../question.service';
import * as firebase from 'Firebase';

@Component({
  selector: 'app-dm-user',
  templateUrl: './dm-user.page.html',
  styleUrls: ['./dm-user.page.scss'],
})
export class DmUserPage implements OnInit {
  @ViewChild('content', {static: false}) private content: any;
  data = { date:'', username:'', message:'' };
  messages = [];
  chatName:any;
  userCurr:string;
  chatter:string;
  offStatus:boolean = false;
  constructor(private route: ActivatedRoute, public router: Router, public service: Service) { 
    this.route.queryParams.subscribe(
      params => {
        console.log(params);
        this.chatName = params.special;
      }
    )
    //console.log(this.chatName);
  }

  ngOnInit() {
    this.route.params.subscribe(
      chat => {
        this.chatName = chat.pChatName;
        this.chatter = chat.username;
      }
    )
    this.service.db.collection("username").doc(firebase.auth().currentUser.uid).get().then(username => {
      this.userCurr=username.data().username;
    });
    console.log(this.chatName);
    var self = this;
    this.service.db.collection("chats").doc(this.chatName).onSnapshot(chatRoom => {
      self.messages = [];
      chatRoom.data().messages.forEach(messageInfo => {
        self.messages.push({username:messageInfo.username, date:messageInfo.date, message:messageInfo.message});
      })
      this.messages = self.messages;
    })

  }

  // getCurrUser(){
  //   let returnUser;
  //   this.service.db.collection("chats").doc(this.chatName).get().then(docSnapshot => {
  //     if (docSnapshot.data().userA == this.chatter) {
  //       returnUser = docSnapshot.data().userB;
  //     }
  //     else {
  //       returnUser = docSnapshot.data().userA;
  //     }
  //   })
  //   return returnUser;
  // }

  sendMessage() {
    //let newData = firebase.database().ref('chatrooms/'+this.+'/chats').push();
    let newData = {
      username:this.userCurr,
      message:this.data.message,
      date:Date()
    };
    this.messages.push(newData);
    console.log(this.messages);
    this.service.db.collection("chats").doc(this.chatName).update({
      messages: this.messages
    }).then(() => {
      this.content.scrollToBottom(300)
    });
    this.data.message = '';
  }

}
