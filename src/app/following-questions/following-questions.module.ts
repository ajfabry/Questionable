import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FollowingQuestionsPageRoutingModule } from './following-questions-routing.module';

import { FollowingQuestionsPage } from './following-questions.page';

import { ComponentsModule } from '../components/components.module';
import { FilterDateFollowingComponent } from './filter-date-following/filter-date-following.component';
import { SortFollowingComponent } from './sort-following/sort-following.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FollowingQuestionsPageRoutingModule,
    ComponentsModule
  ],
  entryComponents: [FilterDateFollowingComponent, SortFollowingComponent],
  declarations: [FollowingQuestionsPage, FilterDateFollowingComponent, SortFollowingComponent]
})
export class FollowingQuestionsPageModule {}
