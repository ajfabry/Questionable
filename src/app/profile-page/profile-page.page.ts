import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.page.html',
  styleUrls: ['./profile-page.page.scss'],
})
export class ProfilePagePage implements OnInit {
  username;
  numPosts;

  constructor(
    private router: Router
    //private service: AppService
  ) {}

  ngOnInit() {
    this.username = "Hu";
    this.numPosts = 20;
  }

  message() {
    console.log("Message " + this.username);
    this.router.navigate(["/answer-question"])
  }
}
