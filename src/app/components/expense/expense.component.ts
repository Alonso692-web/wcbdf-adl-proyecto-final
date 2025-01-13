// src/app/components/log/log.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { LogsService } from '../../services/logs.service';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

interface Expense {
  expenseId: number;
  expenseDate: string;
  amount: number;
  description: string;
}

@Component({
  selector: 'app-log',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbModule],
})
export class LogComponent implements OnInit {
  @ViewChild('logModal') logModal: any;
  @ViewChild('deleteConfirmModal') deleteConfirmModal: any;

  listadoLogs: Expense[] = [];
  loading = false;
  logForm: FormGroup;
  isEditMode = false;
  currentLogId: number | null = null;
  expenseToDeleteId: number | null = null;


  constructor(
    private logsService: LogsService,
    public authService: AuthService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {
    this.logForm = this.fb.group({
      expenseDate: ['', [Validators.required]],
      amount: [0, [Validators.required, Validators.min(0.01)]],
      description: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  ngOnInit() {
    this.cargarLogs();
  }

  cargarLogs() {
    if (this.authService.hasAuthority('READ')) {
      this.loading = true;
      this.logsService.getLogs().subscribe({
        next: (response) => {
          this.listadoLogs = response.expenses || [];
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
      this.expenseToDeleteId = expenseId;
      this.modalService.open(this.deleteConfirmModal, { backdrop: 'static', size: 'sm' });
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

  confirmDelete(modal: any) {
    if (this.expenseToDeleteId !== null) {
      this.logsService.deleteLog(this.expenseToDeleteId).subscribe({
        next: () => {
          modal.close();
          this.listadoLogs = this.listadoLogs.filter(log => log.expenseId !== this.expenseToDeleteId);
          this.expenseToDeleteId = null;
        },
        error: (error) => {
          console.error('Error al eliminar el gasto:', error);
          this.expenseToDeleteId = null;
        },
      });
    }
  }
}