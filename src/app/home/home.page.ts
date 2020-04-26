import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Service } from '../question.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  questions: Array<any>;

  constructor(
    public router: Router,
    public service: Service
  ) 
  { 
    this.service.getObservable().subscribe(data => {
      this.questions = this.service.questions;
    });
  }

  ngOnInit() {
    this.questions = this.service.questions;
  }

  goToQuestion(question) {
    this.router.navigate(["/question", question]);
  }

  login() {
    this.router.navigate(["/login"]);
  }
}
