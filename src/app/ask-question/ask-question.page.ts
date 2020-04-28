import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute} from '@angular/router';
import * as firebase from 'firebase';
import { Service } from '../question.service';

@Component({
  selector: 'app-ask-question',
  templateUrl: './ask-question.page.html',
  styleUrls: ['./ask-question.page.scss'],
})
export class AskQuestionPage implements OnInit {
  question;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: Service) { }

  ngOnInit() {
  }

  submit() {
    let uid = firebase.auth().currentUser.uid;
    let entry = {
      "question":this.question,
      "uid":uid
    };

    this.service.db.collection("questions").add(entry)
    .then(function(docRef) {
      console.log("Document written with ID: ", docRef.id);

      docRef.collection("votes").doc("votes").set({
        [uid]: 1
      });
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });

    this.router.navigate(['../tabs/home']);
  }
}
