import { Component, OnInit, Input } from '@angular/core';
import { HomePage } from '../../home/home.page';
import { Service } from '../../question.service';
import { sum, values } from 'lodash';
import * as firebase from 'firebase';

@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.scss'],
})
export class VoteComponent implements OnInit {

  @Input() currentQuestion;

  voteCount = 0;
  userVote = 0;

  constructor(private homePage: HomePage,
    private service: Service
    ) { }

  ngOnInit() {
    let currentUser = firebase.auth().currentUser;
    if (this.currentQuestion.path != undefined && this.currentQuestion.path != "") {
      this.homePage.getQuestionVotes(this.currentQuestion).onSnapshot(upvotes => {
        this.voteCount = sum(values(upvotes.data()));
        
        if (this.service.loggedIn() && upvotes != null && upvotes.data() != null)
          this.userVote = upvotes.data()[currentUser.uid];
      });
    } else {
      setTimeout(() => {
        this.ngOnInit();
      }, 50);
    }
    return;
  }

  vote(choice) {
    let Vote = this.userVote == choice ? 0 : choice;
    this.homePage.updateVote(this.currentQuestion, Vote);
  }

}
