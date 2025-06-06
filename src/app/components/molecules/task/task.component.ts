import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ITask } from '../../../shared/interfaces/task.interface';
import { StateService } from '../../../shared/services/state/state.service';

@Component({
  selector: 'molecule-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent implements OnInit {
  @Output() public onChangeCompleted = new EventEmitter<boolean>();
  @Output() public onDeleteItem = new EventEmitter<null>();
  @Output() public onEditItem = new EventEmitter<null>();
  @Input() item!: ITask;

  constructor(public stateService: StateService) {}

  ngOnInit() {}

  public onChange(checked: boolean): void {
    this.onChangeCompleted.emit(checked);
  }

  public onDelete(): void {
    this.onDeleteItem.emit();
  }

  public onEdit(): void {
    this.onEditItem.emit();
  }

  public onCancelEdit(): void {
    this.stateService.setSelectedTask(null);
  }

  get isSelectedTask(): boolean {
    return this.stateService.getSelectedTask()?.id === this.item?.id;
  }
}
