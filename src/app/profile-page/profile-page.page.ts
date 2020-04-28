import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  
  message() {
    console.log("Message " + this.username);
    this.router.navigate(["/answer-question"])
  }

  logout() {
    firebase.auth().signOut();
    console.log("Logged out");
    this.router.navigate(['/login']);
  }
}
