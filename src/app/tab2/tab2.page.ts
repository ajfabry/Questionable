import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
//import { AppService } from '../app.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
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
