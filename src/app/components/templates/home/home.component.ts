import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StateService } from '../../../shared/services/state/state.service';
import { ITask } from '../../../shared/interfaces/task.interface';
import { createUniqueId } from '../../../shared/helpers/functions';
@Component({
  selector: 'template-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  public form: FormGroup;
  public selectedTask!: ITask;

  constructor(
    private formBuilder: FormBuilder,
    private toast: ToastrService,
    public stateService: StateService,
  ) {
    this.form = this.formBuilder.group({
      task: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {}

  public onSubmit(): void {
    if (this.form.valid) {
      const { task } = this.form.value;
      const newList = this.stateService.getTasks() ? [...this.stateService.getTasks()] : [];

      if (this.stateService.getSelectedTask()) {
        const index = this.getTaskIndex(this.stateService.getSelectedTask());
        newList[index].name = task;
      } else {
        const newTask: ITask = {
          id: createUniqueId(),
          name: task,
          completed: false,
        }

        newList.push(newTask);
      }

      this.stateService.setTasks(newList);
      this.stateService.setSelectedTask(null);
    }
  }

  public onChangeCompleted(task: ITask, checked: boolean): void {
    const newList = [...this.stateService.getTasks()];
    const index = this.getTaskIndex(task);
    newList[index].completed = checked;
    this.stateService.setTasks(newList);
  }

  public onDeleteItem(task: ITask): void {
    const newList = [...this.stateService.getTasks()];
    const index = this.getTaskIndex(task);
    newList.splice(index, 1);
    this.stateService.setTasks(newList);
    this.toast.success('Task deleted successfully!', 'Success');
  }

  public onEditItem(task: ITask): void {
    this.stateService.setSelectedTask(task);
  }

  public getTaskIndex(task: ITask | null): number {
    return this.stateService.getTasks().findIndex((item: ITask) => task?.id === item?.id);
  }

  get hasTasks(): boolean {
    return this.stateService.getTasks()?.length > 0;
  }
}
