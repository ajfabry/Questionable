import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Service } from '../question.service';
import * as firebase from 'firebase';
import { sum, values } from 'lodash';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.page.html',
  styleUrls: ['./profile-page.page.scss'],
})
export class ProfilePagePage implements OnInit {
  username;
  numPosts;
  uid;
  totalUpvotes = 0;
  posts:Array<any>;
  isfollowing=false;
  followingId;

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
    this.setFollowingVal(this.uid);
    //this.numPosts = 20;
  }
  
  loadUsername(uid) {
    //var currentUser = firebase.auth().currentUser;
    var self = this;
    
    this.service.db.collection("username").doc(uid).get().then(doc => {
      this.username = doc.data().username;
      this.numPosts = doc.data().numPosts;
    });
    this.service.db.collection("username").doc(uid).collection("posts").onSnapshot(function(querySnapshot) {
      self.posts=[];
      //var totalUpvotes=0;
      querySnapshot.forEach(function(doc) {
        var item = doc.data();
        var post = {question: "", timestamp: null, votes: 0, id: doc.ref.id, path: item.path}
      
        self.service.db.doc(item.path).get().then(data=> {
          post.question = data.data().question;
          console.log(post.question);
          post.timestamp = data.data().timestamp;
        });
        //console.log(question);
        
        
        //console.log(item);
        var path = item.path;
        console.log(path);
        var votes;
        self.getQuestionVotes(path).get().then(upvotes => {
          post.votes = sum(values(upvotes.data()));
          self.posts.push(post);
          console.log(post);
          self.addToVotes(post.votes);
        });
      });
      this.posts = self.posts;
    });
    
  }

  getQuestionVotes(path) {
    return this.service.db.doc(path).collection("votes").doc("votes");
  }

  addToVotes(votes) {
    this.totalUpvotes = this.totalUpvotes + votes;
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

  follow() {
    if(this.service.loggedIn()){
      var currUid = firebase.auth().currentUser.uid
      this.service.db.collection("username").doc(currUid).collection("following").add({
        "uid": this.uid
      })
      this.isfollowing = true
    }
  }

  unfollow() {
    if(this.service.loggedIn()){
      var currUid = firebase.auth().currentUser.uid
      this.service.db.collection("username").doc(currUid).collection("following").doc(this.followingId).delete()
      this.isfollowing = false
    }
  }

  logout() {
    firebase.auth().signOut();
    console.log("Logged out");
    this.router.navigate(['/login']);
  }

  isThisYou() {
    if(this.service.loggedIn()){
      return this.uid==firebase.auth().currentUser.uid
    }
    else {
      return false;
    }
  }

  setFollowingVal(uid) {
    var self = this;
    if(this.service.loggedIn()){
      var currUid = firebase.auth().currentUser.uid
      console.log("The id: " + currUid);
      this.service.db.collection("username").doc(currUid).collection("following").onSnapshot(function(querySnapshot) {
        // console.log("DOes this even run?");
        querySnapshot.forEach(function(doc) {
          // console.log(doc.data().uid);
          // console.log(uid);
          if(uid == doc.data().uid){
            self.followingId = doc.id
            self.isfollowing = true
          }
        });
      });
      this.followingId = self.followingId
      this.isfollowing = self.isfollowing
    }
  }

  isFollowing() {
    return this.isfollowing
  }

  goToQuestion(question) {
    this.router.navigate(["/question", question]);
  }
}
