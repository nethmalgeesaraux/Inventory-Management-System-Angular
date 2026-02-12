import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Api } from '../service/api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  constructor(private apiService:Api, private router:Router){}

  formData: any = {
    email: '',
    password: ''
  };

  message:string | null = null;

  async handleSubmit(){
    if( 
      !this.formData.email || 
      !this.formData.password 
    ){
      this.showMessage("All fields are required");
      return;
    }

    try {
      const response: any = await firstValueFrom(
        this.apiService.loginUser(this.formData)
      );
      if (response.status === 200) {
        this.apiService.encryptAndSaveToStorage('token', response.token);
        this.apiService.encryptAndSaveToStorage('role', response.role);
        this.router.navigate(["/dashboard"]);
      }
    } catch (error:any) {
      console.log(error)
      this.showMessage(error?.error?.message || error?.message || "Unable to Login a user" + error)
      
    }
  }

  showMessage(message:string){
    this.message = message;
    setTimeout(() =>{
      this.message = null
    }, 4000)
  }

}