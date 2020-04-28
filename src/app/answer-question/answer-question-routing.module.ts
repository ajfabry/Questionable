import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AnswerQuestionPage } from './answer-question.page';

const routes: Routes = [
  {
    path: '',
    component: AnswerQuestionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnswerQuestionPageRoutingModule {}
