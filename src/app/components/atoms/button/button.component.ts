import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { StateService } from '../../../shared/services/state/state.service';

@Component({
  selector: 'atom-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  @Input() text: string = '';
  @Input() type: string = 'button';
  @Input() color: string = 'primary';
  @Input() formGroup!: FormGroup;

  constructor(public stateService: StateService) {}
}
