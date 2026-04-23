import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { Auth } from '@angular/fire/auth';
import { transaction } from '../../../core/services/transaction';

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
  private route = inject(ActivatedRoute);
  private auth = inject(Auth);

  transactionId: string | null = null;
  isEditMode = false;

  form = this.fb.group({
    amount: [0, [Validators.required]],
    categoryName: ['', [Validators.required]],
    date: ['', [Validators.required]],
    notes: [''],
    type: ['expense', [Validators.required]]
  });

  ngOnInit() {
    this.transactionId = this.route.snapshot.paramMap.get('id');

    if (this.transactionId) {
      this.isEditMode = true;

      this.transactionService.getTransactionById(this.transactionId).subscribe((data) => {
        this.form.patchValue({
          amount: data.amount,
          categoryName: data.categoryName,
          date: data.date,
          notes: data.notes,
          type: data.type
        });
      });
    }
  }

  async onSubmit() {
    if (this.form.invalid || !this.auth.currentUser) return;

    const value = this.form.getRawValue();

    const transactionData = {
      userId: this.auth.currentUser.uid,
      amount: Number(value.amount),
      categoryId: value.categoryName!.toLowerCase(),
      categoryName: value.categoryName!,
      date: value.date!,
      notes: value.notes || '',
      type: value.type as 'income' | 'expense'
    };

    if (this.isEditMode && this.transactionId) {
      await this.transactionService.updateTransaction(this.transactionId, transactionData);
    } else {
      await this.transactionService.addTransaction(transactionData);
    }

    this.router.navigate(['/transactions']);
  }
}