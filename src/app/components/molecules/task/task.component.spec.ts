import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskComponent } from './task.component';
import { By } from '@angular/platform-browser';
import { StateService } from '../../../shared/services/state/state.service';
import { ITask } from '../../../shared/interfaces/task.interface';
import { MaterialModule } from '../../../shared/material/material.module';

describe('TaskComponent', () => {
  let component: TaskComponent;
  let fixture: ComponentFixture<TaskComponent>;
  let stateService: jasmine.SpyObj<StateService>;

  const mockTask: ITask = {
    id: '1',
    name: 'Sample Task',
    completed: false,
  };

  beforeEach(async () => {
    const stateServiceSpy = jasmine.createSpyObj('StateService', ['getSelectedTask', 'setSelectedTask']);

    await TestBed.configureTestingModule({
      declarations: [TaskComponent],
      imports: [MaterialModule],
      providers: [{ provide: StateService, useValue: stateServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskComponent);
    component = fixture.componentInstance;
    stateService = TestBed.inject(StateService) as jasmine.SpyObj<StateService>;

    component.item = mockTask;
  });

  it('should create the component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render task name', () => {
    fixture.detectChanges();
    const title = fixture.debugElement.query(By.css('.task-title')).nativeElement;
    expect(title.textContent).toContain('Sample Task');
  });

  it('should check checkbox based on task.completed', () => {
    component.item.completed = true;
    fixture.detectChanges();

    const checkbox = fixture.debugElement.query(By.css('mat-checkbox'));
    expect(checkbox.componentInstance.checked).toBeTrue();
  });

  it('should emit onChangeCompleted when checkbox is changed', () => {
    spyOn(component.onChangeCompleted, 'emit');
    fixture.detectChanges();

    const checkbox = fixture.debugElement.query(By.css('mat-checkbox'));
    checkbox.triggerEventHandler('change', { checked: true });

    expect(component.onChangeCompleted.emit).toHaveBeenCalledWith(true);
  });

  it('should emit onEditItem when edit icon is clicked', () => {
    stateService.getSelectedTask.and.returnValue(null);
    spyOn(component.onEditItem, 'emit');
    fixture.detectChanges();

    const editIcon = fixture.debugElement.query(By.css('mat-icon'));
    editIcon.triggerEventHandler('click');

    expect(component.onEditItem.emit).toHaveBeenCalled();
  });

  it('should emit onDeleteItem when delete icon is clicked', () => {
    spyOn(component.onDeleteItem, 'emit');
    fixture.detectChanges();

    const deleteIcon = fixture.debugElement.query(By.css('.delete'));
    deleteIcon.triggerEventHandler('click');

    expect(component.onDeleteItem.emit).toHaveBeenCalled();
  });

  it('should call setSelectedTask(null) on cancel edit click', () => {
    stateService.getSelectedTask.and.returnValue(mockTask);
    fixture.detectChanges();

    const cancel = fixture.debugElement.query(By.css('.cancel'));
    cancel.triggerEventHandler('click');

    expect(stateService.setSelectedTask).toHaveBeenCalledWith(null);
  });

  it('should show "Cancel edit" if task is selected', () => {
    stateService.getSelectedTask.and.returnValue(mockTask);
    fixture.detectChanges();

    const cancelText = fixture.debugElement.query(By.css('.cancel'));
    expect(cancelText.nativeElement.textContent).toContain('Cancel edit');
  });

  it('should show "edit" icon if task is NOT selected', () => {
    stateService.getSelectedTask.and.returnValue(null);
    fixture.detectChanges();

    const icon = fixture.debugElement.query(By.css('mat-icon'));
    expect(icon).toBeTruthy();
    expect(icon.attributes['fontIcon']).toBe('edit');
  });
});
