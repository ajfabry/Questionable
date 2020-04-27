import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AnswerQuestionPageRoutingModule } from './answer-question-routing.module';

import { AnswerQuestionPage } from './answer-question.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AnswerQuestionPageRoutingModule
  ],
  declarations: [AnswerQuestionPage]
})
export class AnswerQuestionPageModule {}
