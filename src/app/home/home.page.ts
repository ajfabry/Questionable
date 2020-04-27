import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Service } from '../question.service';
import * as firebase from 'firebase';
import { sum, values } from 'lodash';

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
            
            var question = {question: item.question, votes: 0, id: doc.ref.id, path: doc.ref.path};

            self.questions.push(question);
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

  getQuestionVotes(question) {
    return this.service.db.doc(question.path).collection("votes").doc("votes");
  }

  updateVote(question, vote) {
    var user = firebase.auth().currentUser;

    if (user) { 
      let data = {};
      data[user.uid] = vote;
      this.service.db.doc(question.path).collection("votes").doc("votes").update(data);
    } else {
      alert("You must be signed in to vote on content.");
    }
  }
}
