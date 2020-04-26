import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-answer-question',
  templateUrl: './answer-question.page.html',
  styleUrls: ['./answer-question.page.scss'],
})
export class AnswerQuestionPage implements OnInit {
  question:any;
  answer="";
  followup=""

  constructor(
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(
      param=>{
        this.question = param
      }
    )
  }

  submit() {}

  cancel() {}

}
