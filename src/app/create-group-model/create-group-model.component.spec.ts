import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGroupModelComponent } from './create-group-model.component';

describe('CreateGroupModelComponent', () => {
  let component: CreateGroupModelComponent;
  let fixture: ComponentFixture<CreateGroupModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateGroupModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateGroupModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
