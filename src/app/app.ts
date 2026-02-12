
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Api } from './service/api';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})


export class App{
  title = 'ims';
  constructor(
    private apiService: Api,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}


isAuth():boolean{
  return this.apiService.isAuthenticated();
}

isAdmin():boolean{
  return this.apiService.isAdmin();
}

logOut():void{
  this.apiService.logout();
  this.router.navigate(["/login"])
  this.cdr.detectChanges();
}





}
