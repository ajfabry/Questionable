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
    this.router.navigate(["/question", question]);
  }

}
