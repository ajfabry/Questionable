import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DmMenuPage } from './dm-menu.page';

describe('DmMenuPage', () => {
  let component: DmMenuPage;
  let fixture: ComponentFixture<DmMenuPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DmMenuPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DmMenuPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
