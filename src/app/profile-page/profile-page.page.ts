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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: Service
  ) {
    this.service.getObservable().subscribe((data) => {
      if (data.page == "ProfilePage")
        this.ngOnInit();
    })
  }

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
    
    if (this.service.loggedIn()) {
      this.service.db.collection("username").doc(uid).get().then(doc => {
        console.log(doc.data());
        this.username = doc.data().username;
        this.numPosts = doc.data().numPosts;
      });
      this.service.db.collection("username").doc(uid).collection("posts").onSnapshot(function(querySnapshot) {
        //var self = this;
        var totalUpvotes=0;
        querySnapshot.forEach(function(doc) {
          
          var item = doc.data();
          //console.log(item);
          var path = item.path;
          console.log(path);
          var votes;
          self.getQuestionVotes(path).get().then(upvotes => {
            votes = sum(values(upvotes.data()));
            console.log(votes);
            self.addToVotes(votes);
          });
        });
      });
    }
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
    return this.uid==firebase.auth().currentUser.uid
  }

  editProfile() {
    this.router.navigate(["/edit-profile"]);
  }
}
