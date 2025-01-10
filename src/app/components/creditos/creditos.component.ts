import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-creditos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './creditos.component.html',
  styleUrl: './creditos.component.css'
})
export class CreditosComponent {
  developer = {
    name: 'Alonso Domínguez López',
    group: '7CM2',
    email: 'adominguezl2100@alumno.ipn.mx'
  };
}

