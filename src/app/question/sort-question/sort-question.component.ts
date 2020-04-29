import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

import { Service } from '../../question.service';

@Component({
  selector: 'app-sort-question',
  templateUrl: './sort-question.component.html',
  styleUrls: ['./sort-question.component.scss'],
})
export class SortQuestionComponent implements OnInit {

  constructor(
    public popoverController: PopoverController,
    public service: Service
  ) { }

  ngOnInit() {}

  setSort(sortMethod) {
    this.service.publishEvent({
      page: "QuestionPage",
      sortMethod: sortMethod
    });
    this.popoverController.dismiss();
  }
}
