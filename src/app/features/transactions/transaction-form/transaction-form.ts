import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { transaction } from '../../../core/services/transaction';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './transaction-form.html',
  styleUrl: './transaction-form.css'
})
export class TransactionForm {
  private fb = inject(FormBuilder);
  private transactionService = inject(transaction);
  private router = inject(Router);
  private auth = inject(Auth);

  form = this.fb.group({
    amount: [0, [Validators.required]],
    categoryName: ['', [Validators.required]],
    date: ['', [Validators.required]],
    notes: [''],
    type: ['expense', [Validators.required]]
  });

  async onSubmit() {
    if (this.form.invalid || !this.auth.currentUser) return;

    const value = this.form.getRawValue();

    await this.transactionService.addTransaction({
      userId: this.auth.currentUser.uid,
      amount: Number(value.amount),
      categoryId: value.categoryName!.toLowerCase(),
      categoryName: value.categoryName!,
      date: value.date!,
      notes: value.notes || '',
      type: value.type as 'income' | 'expense'
    });

    this.router.navigate(['/transactions']);
  }
}