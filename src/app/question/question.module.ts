import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QuestionPageRoutingModule } from './question-routing.module';

import { QuestionPage } from './question.page';

import { ComponentsModule } from '../components/components.module';
import { FilterDateQuestionComponent } from './filter-date-question/filter-date-question.component';
import { HomePage } from '../home/home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QuestionPageRoutingModule,
    ComponentsModule
  ],
  entryComponents: [FilterDateQuestionComponent],
  declarations: [QuestionPage, FilterDateQuestionComponent],
  providers: [HomePage]
})
export class QuestionPageModule {}
