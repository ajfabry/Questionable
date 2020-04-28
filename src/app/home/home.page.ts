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
      var numQuestions = 0;
      querySnapshot.forEach(function(doc) {
        numQuestions++;
        var item = doc.data();

        var question = {question: item.question, username: "", votes: 0, id: doc.ref.id, path: doc.ref.path};

        self.getUsername(item.uid).get().then(username => {
          question.username = username.data().username;
        });

        self.getQuestionVotes(question).get().then(upvotes => {
          question.votes = sum(values(upvotes.data()));
          self.questions.push(question);
          if (self.questions.length == numQuestions) {
            self.sortQuestions();
          }
        });
      });
      this.questions = self.questions;
    });
  }

  sortQuestions() {
    this.questions.sort((a,b) => b.votes - a.votes); 
  }

  refreshQuestions(event) {
    this.ngOnInit();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  goToQuestion(question) {
    this.router.navigate(["/question", question]);
  }

  goToAskQuestion() {
    if (this.service.loggedIn()) {
      this.router.navigate(['/ask-question']);
    }
    else {
      alert("You must be signed in to ask a question.");
      this.router.navigate(['/login']);
    }
  }

  login() {
      this.router.navigate(["/login"]);
  }

  profile() {
    this.router.navigate(['/profile-page']);
  }

  getQuestionVotes(question) {
    return this.service.db.doc(question.path).collection("votes").doc("votes");
  }

  getUsername(uid) {
    return this.service.db.collection("username").doc(uid);
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
