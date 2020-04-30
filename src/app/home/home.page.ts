import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Service } from '../question.service';
import * as firebase from 'firebase';
import { sum, values } from 'lodash';
import { PopoverController } from '@ionic/angular';
import { FilterDateHomeComponent } from './filter-date-home/filter-date-home.component';
import { SortHomeComponent } from './sort-home/sort-home.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  questions: Array<any>;
  cutoffDate: Date;
  cutoffDisplay: string;
  toProfile = false;
  sortBy = "votes";

  constructor(
    public router: Router,
    public service: Service,
    public popoverController: PopoverController
  ) 
  {
    this.service.getObservable().subscribe((data) => {
      if (data.sort != null)
        this.setCutoff(data.sort, data.allTime);
      if (data.sortMethod != null)
        this.setSort(data.sortMethod);
      if (data.page == "HomePage")
        this.ngOnInit();
    })
  }

  ngOnInit() {
    this.toProfile = false;
    var self = this;

    let startDate = this.cutoffDate || new Date(Date.now() - 24 * 60 * 60 * 1000);

    if (startDate < new Date(Date.now() - 366 * 24 * 60 * 60 * 1000))
      this.cutoffDisplay = "all time";
    else if (startDate < new Date(Date.now() - 364 * 24 * 60 * 60 * 1000))
      this.cutoffDisplay = "past year";
    else if (startDate < new Date(Date.now() - 29 * 24 * 60 * 60 * 1000))
        this.cutoffDisplay = "past month";
    else if (startDate < new Date(Date.now() - 6 * 24 * 60 * 60 * 1000))
      this.cutoffDisplay = "past week";
    else if (startDate < new Date(Date.now() - 23 * 60 * 60 * 1000))
      this.cutoffDisplay = "past day";
    else
      this.cutoffDisplay = "past hour";

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
            self.questions = self.sortQuestions(self.questions);
          }
        });
      });
      this.questions = self.questions;
    });
  }

  sortQuestions(questions) {
    if (this.sortBy == "votes")
      return questions.sort((a,b) => b.votes - a.votes);
    else if (this.sortBy == "date")
      return questions.sort((a,b) => b.timestamp - a.timestamp);
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

  dmMenu() {
    this.router.navigate(["/dm-menu"]);
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

  async presentSortPopover(event) {
    console.log("presenting popover");
    const popover = await this.popoverController.create({
      component: SortHomeComponent,
      event: event,
      translucent: true
    });
    return await popover.present();
  }

  setCutoff(cutoff, allTime) {
    if (allTime)
      this.cutoffDate = new Date("0001-01-01");
    else
      this.cutoffDate = new Date(Date.now() - cutoff);
  }

  setSort(sortMethod) {
    this.sortBy = sortMethod;
  }
}
