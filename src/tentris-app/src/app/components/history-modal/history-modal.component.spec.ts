import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {HistoryModalComponent} from './history-modal.component';

describe('HistoryModalComponent', () => {
  let component: HistoryModalComponent;
  let fixture: ComponentFixture<HistoryModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HistoryModalComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
