import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Service } from '../question.service';
import * as firebase from 'firebase';
import { sum, values } from 'lodash';
import { PopoverController } from '@ionic/angular';
import { FilterDateHomeComponent } from './filter-date-home/filter-date-home.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  questions: Array<any>;
  cutoffDate: Date;
  toProfile = false;

  constructor(
    public router: Router,
    public service: Service,
    public popoverController: PopoverController
  ) 
  {
    this.service.getObservable().subscribe((data) => {
      if (data.sort != null) {
        console.log(data.sort);
        this.setCutoff(data.sort);
      }
      if (data.page == "HomePage")
        this.ngOnInit();
    })
  }

  ngOnInit() {
    this.toProfile = false;
    var self = this;

    let startDate = this.cutoffDate || new Date(Date.now() - 24 * 60 * 60 * 1000);
    this.service.db.collection("questions").where("timestamp", '>', startDate).onSnapshot(function(querySnapshot) {
      self.questions = [];
      var numQuestions = 0;
      querySnapshot.forEach(function(doc) {
        numQuestions++;
        var item = doc.data();

        var question = {question: item.question, username: "", uid: item.uid, votes: 0, 
                        timestamp: item.timestamp, id: doc.ref.id, path: doc.ref.path};

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
    // TODO: add sort by timestamp (replace property)
    this.questions.sort((a,b) => b.votes - a.votes);
  }

  refreshQuestions(event) {
    this.ngOnInit();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  goToQuestion(question) {
    if(this.toProfile){
      this.goToProfile(question);
    }
    else {
      this.router.navigate(["/question", question]);
    }
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
    this.router.navigate(['/profile-page', firebase.auth().currentUser]);
  }

  goToProfile(question) {
    this.toProfile = false;
    this.router.navigate(['/profile-page', question]);
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

  async presentPopover(event) {
    console.log("presenting popover");
    const popover = await this.popoverController.create({
      component: FilterDateHomeComponent,
      event: event,
      translucent: true
    });
    return await popover.present();
  }

  setCutoff(cutoff) {
    this.cutoffDate = new Date(Date.now() - cutoff);
  }
}
