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

  constructor(
    private route: ActivatedRoute,
    public service: Service,
    public router: Router
  ) { }

  ngOnInit() {
    this.route.params.subscribe(
      question => {
        this.currentQuestion = question;
      }
    )
  }

}
