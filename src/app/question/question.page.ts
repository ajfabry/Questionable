import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Service } from '../question.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.page.html',
  styleUrls: ['./question.page.scss'],
})
export class QuestionPage implements OnInit {

  currentQuestion: any;
  answers: Array<any>;

  constructor (
    private route: ActivatedRoute,
    public service: Service,
    public router: Router
  ) 
  {

  }

  ngOnInit() {
    
    this.route.params.subscribe(
      question => {
        this.currentQuestion = question;
      }
    )
      
    var self = this;
    this.service.db.collection("questions").doc(this.currentQuestion.id).collection("answers").get()
    .then(querySnapshot => {
      self.answers = [];
      querySnapshot.forEach(doc => {
        var item = doc.data();
        self.answers.push({answer: item.answer, question: item.question, id: doc.ref.id, path: doc.ref.path});
      });
      this.answers = self.answers;
    });
  }

  goToAnswerQuestion(question) {
    this.router.navigate(["/answer-question", question]);
  }

  goToQuestion(question) {
    // console.log(this.service.ref.toString());
    // console.log(firebase.firestore.DocumentReference<Array<any>>(question));
    this.router.navigate(["/question", question]);
    this.ngOnInit();
  }

}
