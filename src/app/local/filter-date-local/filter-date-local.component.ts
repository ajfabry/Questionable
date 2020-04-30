import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

import { Service } from '../../question.service';

@Component({
  selector: 'app-filter-date-local',
  templateUrl: './filter-date-local.component.html',
  styleUrls: ['./filter-date-local.component.scss'],
})
export class FilterDateLocalComponent implements OnInit {

  constructor(
    public popoverController: PopoverController,
    public service: Service
    ) { }

  ngOnInit() {}

  setCutoff(cutOff) {
    if (cutOff == 0) {
      this.service.publishEvent({
        page: "LocalPage",
        sort: cutOff,
        allTime: true
      });
      this.popoverController.dismiss();
      return;
    }
    this.service.publishEvent({
      page: "LocalPage",
      sort: cutOff
    });
    this.popoverController.dismiss();
  }
}
