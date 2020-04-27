import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { VoteComponent } from './vote/vote.component';

@NgModule({
    declarations: [VoteComponent],
    imports: [CommonModule, IonicModule.forRoot()],
    exports: [VoteComponent, IonicModule]
})

export class ComponentsModule{}