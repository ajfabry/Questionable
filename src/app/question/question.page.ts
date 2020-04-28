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
  toProfile = false;

  constructor (
    private route: ActivatedRoute,
    public service: Service,
    public router: Router
  ) 
  {
    this.service.getObservable().subscribe((data) => {
      if (data.page == "QuestionPage")
        this.ngOnInit();
    })
  }

  ngOnInit() {
    this.route.params.subscribe(
      question => {
        this.currentQuestion = question;
      }
    )
    
    this.toProfile = false;

    this.docRef = this.service.db.doc(this.currentQuestion.path);
      
    var self = this;
    this.docRef.collection("answers").get()
    .then(querySnapshot => {
      self.answers = [];
      var numAnswers = 0;
      querySnapshot.forEach(doc => {
        numAnswers++;
        var item = doc.data();

        var answer = {question: item.question, answer: item.answer, username: "", uid: item.uid, votes: 0, id: doc.ref.id, path: doc.ref.path};
        
        if(item.uid!=null){
          self.getUsername(item.uid).get().then(username => {
            answer.username = username.data().username;
          });
        }

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
    if(this.service.loggedIn()) {
      this.router.navigate(['/answer-question', question]);
    }
    else {
      alert("You must be signed in to answer a question.");
      this.router.navigate(['/login']);
    }
  }

  goToQuestion(question) {
    if(this.toProfile) {
      this.goToProfile(question);
    }
    else {
      this.router.navigate(["/question", question]);
    }
  }

  goToProfile(answer) {
    this.toProfile = false;
    this.router.navigate(['/profile-page', answer]);
  }

  setToProfile() {
    this.toProfile = true;
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
