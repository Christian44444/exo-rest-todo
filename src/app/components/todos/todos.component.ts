import { Component, EventEmitter, OnInit, Output} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Todo } from 'src/app/models/todo';
import { TodoService } from 'src/app/services/todo.service';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css']
})
export class TodosComponent implements OnInit {
  todos: Todo[] = []; 
  todos$ = this._todoService.todos$;  
  newtodo: Todo = {};

  @Output()
  textEditable = true;
  textMajEvent = new EventEmitter();

  private _subscription?: Subscription;

  constructor(private _todoService: TodoService) {};

  ngOnInit() {
    this._todoService.findAll().subscribe();
    // this._subscription =  this._todoService
    //   .todos$
    //   .subscribe((todos) =>{ this.todos = todos; });
//    this.refrechTodos();
//    this._todoService
//      .findAll()
//      .subscribe(todosReceived => {
//        this.todos = todosReceived;
//      });
  };
  // ngOnDestroy() {
  //   this._subscription?.unsubscribe()
  // }

  createTodo(form: NgForm) {
    if (form.valid ) {
      this._todoService
          .createOne(this.newtodo)
          .subscribe()
      form.reset();     
    } 
  }

  updateTodo(t: any) {
    t.done = !t.done;  
    this._todoService
      .editOne(t)
      .subscribe();
  };

  deleteTodo(t: any) {
    console.log("suppression" , t);
    this._todoService.deleteOne(t).subscribe();
  };

  // refrechTodos() {
  //   this._todoService
  //     .findAll()
  //     .subscribe(todosReceived => {
  //       this.todos = todosReceived.reverse();
  //     });
  // };
  maj(t: any)
  {
    t.isEditable = !t.isEditable;
    this._todoService
        .editOne(t)
        .subscribe();
  }
}
