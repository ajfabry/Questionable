import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  
  message() {
    console.log("Sending message from " + firebase.auth().currentUser.uid + " to " + this.uid);

    this.router.navigate(["/dm-user", this.uid]);
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

  goToQuestion(question) {
    this.router.navigate(["/question", question]);
  }
}
