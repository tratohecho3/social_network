import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  title:string
  constructor() {
    this.title = 'Enviar mensaje'
   }

  ngOnInit() {
  }

}
