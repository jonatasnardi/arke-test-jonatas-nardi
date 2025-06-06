import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { StateService } from '../../../shared/services/state/state.service';

@Component({
  selector: 'atom-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent {
  @Input() name: string = '';
  @Input() placeholder: string = '';
  @Input() label: string = '';
  @Input() formGroup!: FormGroup;

  constructor(public stateService: StateService) {}
}
