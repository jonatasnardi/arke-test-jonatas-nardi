import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { ReactiveFormsModule } from '@angular/forms';
import { provideToastr, ToastrModule, ToastrService } from 'ngx-toastr';
import { StateService } from '../../../shared/services/state/state.service';
import { ITask } from '../../../shared/interfaces/task.interface';
import { By } from '@angular/platform-browser';
import { Component, EventEmitter, Input, NO_ERRORS_SCHEMA, Output } from '@angular/core';
import { MaterialModule } from '../../../shared/material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Mock child components
@Component({ selector: 'atom-title', template: '' }) class MockTitleComponent { @Input() title: string = ''; }
@Component({ selector: 'atom-input', template: '' }) class MockInputComponent { @Input() formGroup: any; @Input() label: string = ''; @Input() name: string = ''; @Input() placeholder: string = ''; }
@Component({ selector: 'atom-button', template: '' }) class MockButtonComponent { @Input() formGroup: any; @Input() color: string = ''; @Input() type: string = ''; @Input() text: string = ''; }
@Component({ selector: 'organism-task-list', template: '<ng-content></ng-content>' }) class MockTaskListComponent {}
@Component({ selector: 'molecule-task', template: '' }) class MockTaskComponent {
  @Input() item!: ITask;
  @Output() onChangeCompleted = new EventEmitter<boolean>();
  @Output() onDeleteItem = new EventEmitter<null>();
  @Output() onEditItem = new EventEmitter<null>();
}

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let stateServiceSpy: jasmine.SpyObj<StateService>;
  let toastSpy: jasmine.SpyObj<ToastrService>;

  const mockTasks: ITask[] = [
    { id: '1', name: 'Task One', completed: false },
    { id: '2', name: 'Task Two', completed: true }
  ];

  beforeEach(async () => {
    stateServiceSpy = jasmine.createSpyObj('StateService', [
      'getTasks', 'setTasks',
      'getSelectedTask', 'setSelectedTask'
    ]);
    toastSpy = jasmine.createSpyObj('ToastrService', ['success']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule, 
        BrowserAnimationsModule,
        MaterialModule, 
        ToastrModule.forRoot()
      ],
      declarations: [
        HomeComponent,
        MockTitleComponent,
        MockInputComponent,
        MockButtonComponent,
        MockTaskListComponent,
        MockTaskComponent,
      ],
      providers: [
        { provide: ToastrService, useValue: toastSpy },
        { provide: StateService, useValue: stateServiceSpy },
        provideToastr({}),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('onSubmit', () => {
    it('should add a new task if form is valid and no selected task', () => {
      component.form.controls['task'].setValue('New Task');
      stateServiceSpy.getSelectedTask.and.returnValue(null);
      stateServiceSpy.getTasks.and.returnValue([]);

      spyOn<any>(component, 'getTaskIndex').and.callThrough();
      component.onSubmit();

      expect(stateServiceSpy.setTasks).toHaveBeenCalled();
      expect(stateServiceSpy.setSelectedTask).toHaveBeenCalledWith(null);
    });

    it('should update an existing task if selectedTask is present', () => {
      const selected = mockTasks[0];
      stateServiceSpy.getSelectedTask.and.returnValue(selected);
      stateServiceSpy.getTasks.and.returnValue([...mockTasks]);

      component.form.controls['task'].setValue('Updated Task');
      component.onSubmit();

      const updatedTasks = stateServiceSpy.setTasks.calls.mostRecent().args[0];
      expect(updatedTasks[0].name).toBe('Updated Task');
      expect(stateServiceSpy.setSelectedTask).toHaveBeenCalledWith(null);
    });

    it('should do nothing if form is invalid', () => {
      component.form.controls['task'].setValue('');
      component.onSubmit();

      expect(stateServiceSpy.setTasks).not.toHaveBeenCalled();
    });
  });

  describe('onChangeCompleted', () => {
    it('should update task completion state', () => {
      stateServiceSpy.getTasks.and.returnValue([...mockTasks]);
      const task = mockTasks[0];
      component.onChangeCompleted(task, true);

      const updatedList = stateServiceSpy.setTasks.calls.mostRecent().args[0];
      expect(updatedList[0].completed).toBeTrue();
    });
  });

  describe('onDeleteItem', () => {
    it('should delete the task and show toast', () => {
      stateServiceSpy.getTasks.and.returnValue([...mockTasks]);

      component.onDeleteItem(mockTasks[0]);

      const updatedList = stateServiceSpy.setTasks.calls.mostRecent().args[0];
      expect(updatedList.length).toBe(1);
      expect(updatedList[0].id).toBe('2');
      expect(toastSpy.success).toHaveBeenCalledWith('Task deleted successfully!', 'Success');
    });
  });

  describe('onEditItem', () => {
    it('should set selected task', () => {
      component.onEditItem(mockTasks[0]);
      expect(stateServiceSpy.setSelectedTask).toHaveBeenCalledWith(mockTasks[0]);
    });
  });

  describe('getTaskIndex', () => {
    it('should return correct index for task', () => {
      stateServiceSpy.getTasks.and.returnValue([...mockTasks]);
      const index = component.getTaskIndex(mockTasks[1]);
      expect(index).toBe(1);
    });
  });

  describe('hasTasks getter', () => {
    it('should return true if there are tasks', () => {
      stateServiceSpy.getTasks.and.returnValue([...mockTasks]);
      expect(component.hasTasks).toBeTrue();
    });

    it('should return false if no tasks', () => {
      stateServiceSpy.getTasks.and.returnValue([]);
      expect(component.hasTasks).toBeFalse();
    });
  });

  describe('template rendering', () => {
    it('should show fallback message if no tasks', () => {
      stateServiceSpy.getTasks.and.returnValue([]);
      fixture.detectChanges();

      const fallback = fixture.debugElement.query(By.css('p'));
      expect(fallback.nativeElement.textContent).toContain('No tasks found');
    });

    it('should render task list if tasks exist', () => {
      stateServiceSpy.getTasks.and.returnValue([...mockTasks]);
      fixture.detectChanges();

      const taskList = fixture.debugElement.query(By.css('organism-task-list'));
      expect(taskList).toBeTruthy();
    });
  });
});
