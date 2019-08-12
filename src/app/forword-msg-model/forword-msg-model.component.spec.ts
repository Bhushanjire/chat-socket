import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForwordMsgModelComponent } from './forword-msg-model.component';

describe('ForwordMsgModelComponent', () => {
  let component: ForwordMsgModelComponent;
  let fixture: ComponentFixture<ForwordMsgModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForwordMsgModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForwordMsgModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
