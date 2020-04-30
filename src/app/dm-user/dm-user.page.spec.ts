import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DmUserPage } from './dm-user.page';

describe('DmUserPage', () => {
  let component: DmUserPage;
  let fixture: ComponentFixture<DmUserPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DmUserPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DmUserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
