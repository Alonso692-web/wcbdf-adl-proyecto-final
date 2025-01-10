/*import { Component, OnInit, ViewChild } from '@angular/core';
import { LogsService } from '../../services/logs.service';
import { AuthService } from '../../services/auth.service';
import { Log } from '../../models/log.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbModule
  ]
})
export class LogComponent implements OnInit {
  @ViewChild('logModal') logModal: any;
  listadoLogs: Log[] = [];
  loading = false;
  logForm: FormGroup;
  isEditMode = false;
  currentLogId: number | null = null;

  constructor(
    private logsService: LogsService,
    public authService: AuthService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {
    this.logForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]]
    });
  }

  ngOnInit() {
    this.cargarLogs();
  }

  cargarLogs() {
    if (this.authService.hasAuthority('READ')) {
      this.loading = true;
      this.logsService.getLogs().subscribe({
        next: (logs) => {
          this.listadoLogs = logs;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading logs:', error);
          this.loading = false;
        }
      });
    }
  }

  createLog() {
    this.isEditMode = false;
    this.logForm.reset();
    this.modalService.open(this.logModal, { backdrop: 'static', size: 'lg' });
  }

  editLog(log: Log) {
    this.isEditMode = true;
    this.currentLogId = log.customerId;
    this.logForm.patchValue({
      firstName: log.firstName,
      lastName: log.lastName,
      email: log.email,
      phoneNumber: log.phoneNumber
    });
    this.modalService.open(this.logModal, { backdrop: 'static', size: 'lg' });
  }

  eliminarLog(id: number) {
    if (this.authService.hasAuthority('DELETE')) {
      if (confirm('¿Está seguro que desea eliminar este registro?')) {
        this.logsService.deleteLog(id).subscribe({
          next: () => {
            this.cargarLogs();
          },
          error: (error) => {
            console.error('Error deleting log:', error);
          }
        });
      }
    }
  }

  onSubmitLog(modal: any) {
    if (this.logForm.invalid) {
      return;
    }

    const logData: Partial<Log> = this.logForm.value;

    if (this.isEditMode && this.currentLogId) {
      if (!this.authService.hasAuthority('UPDATE')) {
        alert('No tienes permiso para actualizar registros.');
        return;
      }
      this.logsService.updateLog(this.currentLogId, logData).subscribe({
        next: () => {
          modal.close();
          this.cargarLogs();
        },
        error: (err) => {
          console.error('Error updating log:', err);
        }
      });
    } else {
      if (!this.authService.hasAuthority('CREATE')) {
        alert('No tienes permiso para crear registros.');
        return;
      }
      this.logsService.createLog(logData).subscribe({
        next: () => {
          modal.close();
          this.cargarLogs();
        },
        error: (err) => {
          console.error('Error creating log:', err);
        }
      });
    }
  }
}*/

import { Component, OnInit, ViewChild } from '@angular/core';
import { LogsService } from '../../services/logs.service';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Definir la interfaz para el gasto
interface Expense {
  expenseId: number;
  expenseDate: string;
  amount: number;
  description: string;
}

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbModule],
})
export class LogComponent implements OnInit {
  @ViewChild('logModal') logModal: any; // Referencia al modal
  listadoLogs: Expense[] = []; // Lista de gastos
  loading = false; // Estado de carga
  logForm: FormGroup; // Formulario reactivo
  isEditMode = false; // Modo edición
  currentLogId: number | null = null; // ID actual del gasto

  constructor(
    private logsService: LogsService,
    public authService: AuthService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {
    // Inicializar formulario reactivo
    this.logForm = this.fb.group({
      expenseDate: ['', [Validators.required]],
      amount: [0, [Validators.required, Validators.min(0.01)]],
      description: ['', [Validators.required, Validators.minLength(3)]],
    });

  }


  ngOnInit() {
    this.cargarLogs(); // Cargar gastos al iniciar
  }

  cargarLogs() {
    if (this.authService.hasAuthority('READ')) {
      this.loading = true;
      this.logsService.getLogs().subscribe({
        next: (response) => {
          // Accede a la propiedad expenses
          this.listadoLogs = response.expenses || []; // Asigna un arreglo vacío si no hay datos
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al cargar los gastos:', error);
          this.loading = false;
        },
      });
    }
  }
  


  createLog() {
    this.isEditMode = false;
    this.logForm.reset({
      amount: 0,
      expenseDate: new Date().toISOString().split('T')[0],
    });
    this.modalService.open(this.logModal, { backdrop: 'static', size: 'lg' });
  }

  editLog(expense: Expense) {
    this.isEditMode = true;
    this.currentLogId = expense.expenseId;
    this.logForm.patchValue({
      expenseDate: expense.expenseDate,
      amount: expense.amount,
      description: expense.description,
    });
    this.modalService.open(this.logModal, { backdrop: 'static', size: 'lg' });
  }

  eliminarLog(expenseId: number) {
    if (this.authService.hasAuthority('DELETE')) {
      if (confirm('¿Está seguro que desea eliminar este gasto?')) {
        this.logsService.deleteLog(expenseId).subscribe({
          next: () => {
            this.cargarLogs();
          },
          error: (error) => {
            console.error('Error al eliminar el gasto:', error);
          },
        });
      }
    } else {
      alert('No tienes permiso para eliminar gastos.');
    }
  }

  onSubmitLog(modal: any) {
    if (this.logForm.invalid) {
      return;
    }

    const expenseData: Partial<Expense> = {
      ...this.logForm.value,
      amount: parseFloat(this.logForm.value.amount),
    };

    if (this.isEditMode && this.currentLogId) {
      if (!this.authService.hasAuthority('UPDATE')) {
        alert('No tienes permiso para actualizar gastos.');
        return;
      }
      this.logsService.updateLog(this.currentLogId, expenseData).subscribe({
        next: () => {
          modal.close();
          this.cargarLogs();
        },
        error: (err) => {
          console.error('Error al actualizar el gasto:', err);
        },
      });
    } else {
      if (!this.authService.hasAuthority('CREATE')) {
        alert('No tienes permiso para crear gastos.');
        return;
      }
      this.logsService.createLog(expenseData).subscribe({
        next: () => {
          modal.close();
          this.cargarLogs();
        },
        error: (err) => {
          console.error('Error al crear el gasto:', err);
        },
      });
    }
  }
}
