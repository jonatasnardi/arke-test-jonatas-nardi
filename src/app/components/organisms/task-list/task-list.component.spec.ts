import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskListComponent } from './task-list.component';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MaterialModule } from '../../../shared/material/material.module';

@Component({
  template: `
    <organism-task-list>
      <div class="mock-task">Mock Task Content</div>
    </organism-task-list>
  `
})
class TestHostComponent {}

describe('TaskListComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaskListComponent, TestHostComponent],
      imports: [MaterialModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should create the TaskListComponent inside the host', () => {
    const taskListEl = fixture.debugElement.query(By.directive(TaskListComponent));
    expect(taskListEl).toBeTruthy();
  });

  it('should render mat-grid-list with correct attributes', () => {
    const gridList = fixture.debugElement.query(By.css('mat-grid-list'));
    expect(gridList).toBeTruthy();
    expect(gridList.attributes['ng-reflect-cols']).toBe('1');
    expect(gridList.attributes['ng-reflect-row-height']).toBe('30:1');
    expect(gridList.attributes['ng-reflect-gutter-size']).toBe('10px');
  });

  it('should project ng-content inside mat-grid-list', () => {
    const projectedContent = fixture.debugElement.query(By.css('.mock-task'));
    expect(projectedContent).toBeTruthy();
    expect(projectedContent.nativeElement.textContent).toContain('Mock Task Content');
  });
});
