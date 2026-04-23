import { Injectable, inject } from '@angular/core';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private firestore = inject(Firestore);

  async createUserProfile(uid: string, email: string) {
    const userRef = doc(this.firestore, `users/${uid}`);

    await setDoc(userRef, {
      uid,
      email,
      name: '',
      budgetGoals: 0
    });
  }
}