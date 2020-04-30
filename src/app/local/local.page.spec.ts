import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LocalPage } from './local.page';

describe('LocalPage', () => {
  let component: LocalPage;
  let fixture: ComponentFixture<LocalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LocalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
