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
  ) {}

  ngOnInit() {
    var self = this;

    this.service.db.collection("questions").onSnapshot(function(querySnapshot) {
        self.questions = [];
        querySnapshot.forEach(function(doc) {
            var item = doc.data();
            self.questions.push({question:item.question, id: doc.ref.id, path: doc.ref.path});
        });
        this.questions = self.questions;
    });
  }

  goToQuestion(question) {
    this.router.navigate(["/question", question]);
  }

  login() {
    this.router.navigate(["/login"]);
  }
}
