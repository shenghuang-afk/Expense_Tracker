import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Auth } from '@angular/fire/auth';
import { BudgetService } from '../../../core/services/budget.service';

@Component({
  selector: 'app-budget-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './budget-form.html',
  styleUrl: './budget-form.css'
})
export class BudgetForm {
  private fb = inject(FormBuilder);
  private budgetService = inject(BudgetService);
  private auth = inject(Auth);
  private router = inject(Router);

  form = this.fb.group({
    categoryName: ['', [Validators.required]],
    limit: [0, [Validators.required]],
    month: ['', [Validators.required]]
  });

  async onSubmit() {
    if (this.form.invalid || !this.auth.currentUser) return;

    const value = this.form.getRawValue();

    await this.budgetService.addBudget({
      userId: this.auth.currentUser.uid,
      categoryName: value.categoryName!,
      limit: Number(value.limit),
      month: value.month!
    });

    this.router.navigate(['/dashboard']);
  }
}