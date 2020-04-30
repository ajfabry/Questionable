import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

import { Service } from '../../question.service';

@Component({
  selector: 'app-filter-date-question',
  templateUrl: './filter-date-question.component.html',
  styleUrls: ['./filter-date-question.component.scss'],
})
export class FilterDateQuestionComponent implements OnInit {

  constructor(
    public popoverController: PopoverController,
    public service: Service
    ) { }

  ngOnInit() {}

  setCutoff(cutOff) {
    if (cutOff == 0) {
      this.service.publishEvent({
        page: "QuestionPage",
        sort: cutOff,
        allTime: true
      });
      this.popoverController.dismiss();
      return;
    }
    this.service.publishEvent({
      page: "QuestionPage",
      sort: cutOff
    });
    this.popoverController.dismiss();
  }
}
