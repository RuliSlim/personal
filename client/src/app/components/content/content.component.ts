import { Component } from "@angular/core";

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})

export class ContentComponent {
  constructor(){}
  content = `Hey!!
  My name Ruli. <br/>
  This is my personal website. <br/>
  Well, it's kinda how i show up my skilss i guess? lol <br/>
  Anyways, you can look around get info about my status here. <br/>
  Cheeers, peace out..
  `
}