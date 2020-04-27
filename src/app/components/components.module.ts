import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';


import { VoteComponent } from './vote/vote.component';

@NgModule({
    declarations: [VoteComponent],
    imports: [IonicModule.forRoot()],
    exports: [VoteComponent, IonicModule]
})

export class ComponentsModule{}