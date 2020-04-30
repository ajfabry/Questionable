import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Service } from '../question.service';
import * as firebase from 'firebase';
import { sum, values } from 'lodash';
import { PopoverController } from '@ionic/angular';
import { FilterDateQuestionComponent } from './filter-date-question/filter-date-question.component';
import { SortQuestionComponent } from './sort-question/sort-question.component';

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
  cutoffDate: Date;
  cutoffDisplay: string;
  sortBy = "votes";

  constructor (
    private route: ActivatedRoute,
    public service: Service,
    public router: Router,
    public popoverController: PopoverController
  ) 
  {
    this.service.getObservable().subscribe((data) => {
      if (data.sort != null)
        this.setCutoff(data.sort, data.allTime);
      if (data.sortMethod != null)
        this.setSort(data.sortMethod);
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

    this.docRef.collection("answers").where("timestamp", '>', startDate).get()
    .then(querySnapshot => {
      self.answers = [];
      var numAnswers = 0;
      querySnapshot.forEach(doc => {
        numAnswers++;
        var item = doc.data();

        var answer = {question: item.question, answer: item.answer, username: "", uid: item.uid, 
                      timestamp: item.timestamp, votes: 0, id: doc.ref.id, path: doc.ref.path};
        
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
    if (this.sortBy == "votes")
      this.answers.sort((a,b) => b.votes - a.votes);
    else if (this.sortBy == "date")
      this.answers.sort((a,b) => b.timestamp - a.timestamp);
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

  routeHome() {
    this.router.navigate(["../tabs/home"]);
  }

  async presentPopover(event) {
    console.log("presenting popover");
    const popover = await this.popoverController.create({
      component: FilterDateQuestionComponent,
      event: event,
      translucent: true
    });
    return await popover.present();
  }

  async presentSortPopover(event) {
    console.log("presenting popover");
    const popover = await this.popoverController.create({
      component: SortQuestionComponent,
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
