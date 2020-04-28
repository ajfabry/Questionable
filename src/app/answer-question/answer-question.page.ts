import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute} from '@angular/router';
import * as firebase from 'firebase';
import { Service } from '../question.service';

@Component({
  selector: 'app-answer-question',
  templateUrl: './answer-question.page.html',
  styleUrls: ['./answer-question.page.scss'],
})
export class AnswerQuestionPage implements OnInit {
  question:any;
  answer="";
  followup="";
  docRef: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: Service) { }

  ngOnInit() {
    this.route.params.subscribe(
      param=>{
        this.question = param
      }
    )
  }

  submit() {
    let uid = firebase.auth().currentUser.uid;
    let entry = {
      "answer":this.answer,
      "question":this.followup,
      "uid":uid
    };

    this.docRef = this.service.db.doc(this.question.path);

    this.docRef.collection("answers").add(entry)
    .then(function(docRef) {
      console.log("Document written with ID: ", docRef.id);

      docRef.collection("votes").doc("votes").set({
        [uid]: 1
      });
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });


    this.router.navigate(['/question',this.question]);
  }
}
