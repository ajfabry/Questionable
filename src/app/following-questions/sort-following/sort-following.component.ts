import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

import { Service } from '../../question.service';

@Component({
  selector: 'app-sort-following',
  templateUrl: './sort-following.component.html',
  styleUrls: ['./sort-following.component.scss'],
})
export class SortFollowingComponent implements OnInit {

  constructor(
    public popoverController: PopoverController,
    public service: Service
  ) { }

  ngOnInit() {}

  setSort(sortMethod) {
    this.service.publishEvent({
      page: "FollowingPage",
      sortMethod: sortMethod
    });
    this.popoverController.dismiss();
  }
}
