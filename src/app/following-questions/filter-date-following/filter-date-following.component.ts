import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

import { Service } from '../../question.service';

@Component({
  selector: 'app-filter-date-following',
  templateUrl: './filter-date-following.component.html',
  styleUrls: ['./filter-date-following.component.scss'],
})
export class FilterDateFollowingComponent implements OnInit {

  constructor(
    public popoverController: PopoverController,
    public service: Service
    ) { }

  ngOnInit() {}

  setCutoff(cutOff) {
    if (cutOff == 0) {
      this.service.publishEvent({
        page: "FollowingPage",
        sort: cutOff,
        allTime: true
      });
      this.popoverController.dismiss();
      return;
    }
    this.service.publishEvent({
      page: "FollowingPage",
      sort: cutOff
    });
    this.popoverController.dismiss();
  }
}
