import { Component, OnInit } from '@angular/core';
import {DateService} from '../shared/date.service'
import {FormControl, FormGroup, Validators} from '@angular/forms'
import {Task, TasksService} from '../shared/tasks.service'
import {switchMap} from 'rxjs/operators'

@Component({
  selector: 'app-organizer',
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.scss']
})
export class OrganizerComponent implements OnInit {

  public form: FormGroup
  public tasks: Task[] | undefined

  constructor(public dateService: DateService, private tasksService: TasksService) {
    this.form = new FormGroup({
      title: new FormControl('', Validators.required)
    })
  }

  submit() {
    const title = this.form?.value.title

    const task: Task = {
      title,
      date: this.dateService.date.value.format('DD-MM-YYYY')
    }

    this.tasksService.create(task).subscribe(
      task => {
        this.tasks?.push(task)
        this.form.reset()
      },
      error => {console.error(error)}
    )
  }

  remove(task: Task) {
    this.tasksService.remove(task).subscribe(
      () => {
        this.tasks = this.tasks?.filter(t => t.id !== task.id)
      },
      error => {console.log(error)}
    )
  }

  ngOnInit(): void {
    this.dateService.date.pipe(
      switchMap(value => this.tasksService.load(value))
    ).subscribe(tasks => this.tasks = tasks)
  }

}
