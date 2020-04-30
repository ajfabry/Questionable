import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SortLocalComponent } from './sort-local.component';

describe('SortLocalComponent', () => {
  let component: SortLocalComponent;
  let fixture: ComponentFixture<SortLocalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SortLocalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SortLocalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
