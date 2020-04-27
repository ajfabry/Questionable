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
  db;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: Service
  ) {}

  ngOnInit() {
    this.username = this.service.getUsername();
    console.log("This should run after the getUsername function");
    this.numPosts = 20;
  }
  /*
  loadUsername() {
    this.db = this.service.db;
    var ref = firebase.database().ref("username");
    var currentUser = firebase.auth().currentUser;
    console.log(firebase.auth().currentUser)
    this.db.collection("username").where("uid","==",currentUser.uid)
    .onSnapshot(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        var item = doc.data;
        console.log(item.username);
      })
    })
    
    console.log("waited");
    //return string;
  }
  */
  message() {
    console.log("Message " + this.username);
    this.router.navigate(["/answer-question"])
  }

  logout() {
    firebase.auth().signOut();
    console.log("Logged out");
    this.router.navigate(['/login']);
  }

  return() {
    this.router.navigate(['../tabs/home']);
  }
}
