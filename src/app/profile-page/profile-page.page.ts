import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Service } from '../question.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.page.html',
  styleUrls: ['./profile-page.page.scss'],
})
export class ProfilePagePage implements OnInit {
  username;
  numPosts;
  uid;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: Service
  ) {}

  ngOnInit() { 
    this.route.params.subscribe(
      question => {
        this.uid = question.uid;
      }
    )

    this.loadUsername(this.uid);
    //this.username = this.loadUsername();
    console.log("This should run after the getUsername function");
    //this.numPosts = 20;
  }
  
  loadUsername(uid) {
    //var currentUser = firebase.auth().currentUser;

    if (this.service.loggedIn()) {
      this.service.db.collection("username").doc(uid).get().then(doc => {
        this.username = doc.data().username;
        this.numPosts = doc.data().numPosts;
      });
    }
  }
  
  getChatName(uid1, uid2){
    let uids = [uid1, uid2]
    let concatName = '';
    uids.sort();
    for(let i=0; i<uids.length;i++){
      concatName += '-' + uids[i];
    }
    return concatName;
  }

  message() {
    console.log("Sending message from " + firebase.auth().currentUser.uid + " to " + this.uid);
    var pChatName = this.getChatName(this.uid,firebase.auth().currentUser.uid);
    let userA;
    let userB;
    if (this.service.loggedIn()) {
      this.service.db.collection("username").doc(this.uid).get().then(username => {
        userA=username.data().username;
        this.service.db.collection("username").doc(firebase.auth().currentUser.uid).get().then(username => {
          userB=username.data().username;
          this.service.db.collection("chats").doc(pChatName).get().then(docSnapshot => {
            if (docSnapshot.exists) {
              // let navigationExtras: NavigationExtras = {
              //   queryParams: {
              //     special: pChatName
              //   }
              // }
              // this.router.navigate(['/dm-user'], navigationExtras);
              let chat;
              this.service.db.collection("chats").doc(pChatName).get().then(doc => {
                if(doc.data().UserA == userB){
                  chat = {pChatName:pChatName, username:userA};
                }
                else{
                  chat = {pChatName:pChatName, username:userB};
                }
                this.router.navigate(['/dm-user', chat]);
              });
              }
              else{
                let entry = {
                  "UserA":userA,
                  "UserB":userB,
                  "messages":[]
                };
                this.service.db.collection("chats").doc(pChatName).set(entry);
                console.log("created document " + pChatName + " in chats");
                let convEntry = {
                  "UserA":userA,
                  "UserB":userB,
                  "roomName":pChatName
                }
                this.service.db.collection("username").doc(this.uid).collection("conversations").doc().set(convEntry);
                this.service.db.collection("username").doc(firebase.auth().currentUser.uid).collection("conversations").doc().set(convEntry);
                console.log("added chat " + pChatName + " to " + userA + " and " + userB);
                // let navigationExtras: NavigationExtras = {
                //   queryParams: {
                //     special: pChatName
                //   }
                // }
                let chat = {pChatName:pChatName, username:userA};
                this.router.navigate(['/dm-user', chat]);
              }
            });
        });
      });
    }
    else{
      this.router.navigate(['/login']);
    }
    
  }

  logout() {
    firebase.auth().signOut();
    console.log("Logged out");
    this.router.navigate(['/login']);
  }

  isThisYou() {
    return this.uid==firebase.auth().currentUser.uid
  }
}
