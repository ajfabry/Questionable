import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Service } from '../question.service';
import * as firebase from 'firebase';
import { sum, values } from 'lodash';

@Component({
  selector: 'app-question',
  templateUrl: './question.page.html',
  styleUrls: ['./question.page.scss'],
})
export class QuestionPage implements OnInit {

  currentQuestion: any;
  answers: Array<any>;
  docRef: any;

  constructor (
    private route: ActivatedRoute,
    public service: Service,
    public router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(
      question => {
        this.currentQuestion = question;
      }
    )

    this.docRef = this.service.db.doc(this.currentQuestion.path);
      
    var self = this;
    this.docRef.collection("answers").get()
    .then(querySnapshot => {
      self.answers = [];
      var numAnswers = 0;
      querySnapshot.forEach(doc => {
        numAnswers++;
        var item = doc.data();

        var answer = {question: item.question, answer: item.answer, votes: 0, id: doc.ref.id, path: doc.ref.path};
            
        self.getQuestionVotes(answer).get().then(upvotes => {
          answer.votes = sum(values(upvotes.data()));
          self.answers.push(answer);
          if (self.answers.length == numAnswers) {
            self.sortAnswers();
          }
        });
      });
      this.answers = self.answers;
    });
  }

  sortAnswers() {
    this.answers.sort((a,b) => b.votes - a.votes);
  }

  refreshAnswers(event) {
    this.ngOnInit();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  goToAnswerQuestion(question) {
    this.router.navigate(["/answer-question", question]);
  }

  goToQuestion(question) {
    this.router.navigate(["/question", question]);
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
