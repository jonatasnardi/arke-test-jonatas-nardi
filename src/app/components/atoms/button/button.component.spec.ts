import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { StateService } from '../../../shared/services/state/state.service';
import { DebugElement } from '@angular/core';
import { MaterialModule } from '../../../shared/material/material.module';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;
  let buttonDe: DebugElement;
  let stateService: jasmine.SpyObj<StateService>;
  let formGroup: FormGroup;

  beforeEach(async () => {
    const stateServiceSpy = jasmine.createSpyObj('StateService', ['getSelectedTask']);

    await TestBed.configureTestingModule({
      declarations: [ButtonComponent],
      imports: [ReactiveFormsModule, MaterialModule,],
      providers: [
        { provide: StateService, useValue: stateServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    stateService = TestBed.inject(StateService) as jasmine.SpyObj<StateService>;
    formGroup = new FormBuilder().group({});
    component.formGroup = formGroup;
    component.text = 'Create';
    component.type = 'submit';
    component.color = 'accent';
    fixture.detectChanges();

    buttonDe = fixture.debugElement.query(By.css('button'));
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should bind the correct formGroup', () => {
    expect(component.formGroup).toBeTruthy();
  });

  it('should render the button with provided text when no task is selected', () => {
    stateService.getSelectedTask.and.returnValue(null);
    fixture.detectChanges();

    const btn = buttonDe.nativeElement as HTMLButtonElement;
    expect(btn.textContent?.trim()).toBe('Create');
  });

  it('should render the button with "Edit" text when a task is selected', () => {
    stateService.getSelectedTask.and.returnValue({ id: '1', name: 'Test Task', completed: false });
    fixture.detectChanges();

    const btn = buttonDe.nativeElement as HTMLButtonElement;
    expect(btn.textContent?.trim()).toBe('Edit');
  });

  it('should apply the correct button attributes', () => {
    const btn = buttonDe.nativeElement as HTMLButtonElement;
    expect(btn.getAttribute('type')).toBe('submit');
    expect(btn.getAttribute('ng-reflect-color')).toBe('accent');
  });
});
