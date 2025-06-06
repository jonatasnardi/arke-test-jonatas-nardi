import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputComponent } from './input.component';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { StateService } from '../../../shared/services/state/state.service';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../../../shared/material/material.module';

describe('InputComponent', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;
  let stateService: jasmine.SpyObj<StateService>;
  let formGroup: FormGroup;

  beforeEach(async () => {
    const stateServiceSpy = jasmine.createSpyObj('StateService', ['getSelectedTask']);

    await TestBed.configureTestingModule({
      declarations: [InputComponent],
      imports: [
        ReactiveFormsModule,
        MaterialModule,
        NoopAnimationsModule, 
      ],
      providers: [
        { provide: StateService, useValue: stateServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(InputComponent);
    component = fixture.componentInstance;
    stateService = TestBed.inject(StateService) as jasmine.SpyObj<StateService>;

    formGroup = new FormBuilder().group({
      task: ['']
    });

    // Inputs
    component.name = 'task';
    component.placeholder = 'Type here...';
    component.label = 'Create task';
    component.formGroup = formGroup;
  });

  it('should create the component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render the correct label and placeholder', () => {
    stateService.getSelectedTask.and.returnValue(null);
    fixture.detectChanges();

    const label = fixture.debugElement.query(By.css('mat-label')).nativeElement;
    const input = fixture.debugElement.query(By.css('input')).nativeElement;

    expect(label.textContent).toContain('Create task');
    expect(input.placeholder).toBe('Type here...');
  });

  it('should show empty input if no task is selected', () => {
    stateService.getSelectedTask.and.returnValue(null);
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('input')).nativeElement;
    expect(input.value).toBe('');
  });

  it('should bind input to formControlName', () => {
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input')).nativeElement;

    input.value = 'New Task';
    input.dispatchEvent(new Event('input'));

    expect(formGroup.get('task')?.value).toBe('New Task');
  });
});
