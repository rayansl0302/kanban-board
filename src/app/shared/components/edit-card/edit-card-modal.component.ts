import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Card } from '../../model/card/card/card.module';
import { User } from '../../model/card/user/user.module';
import { UserService } from '../../services/user-service/user.service';
@Component({
  selector: 'app-edit-card-modal',
  templateUrl: './edit-card-modal.component.html',
  styleUrls: ['./edit-card-modal.component.scss']
})
export class EditCardModalComponent implements OnInit {
  editForm!: FormGroup;
  usuarios: User[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private dialogRef: MatDialogRef<EditCardModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { card: Card }
  ) { }

  ngOnInit() {
    this.initializeForm();
    this.carregarUsuarios();
  }

  initializeForm() {
    this.editForm = this.formBuilder.group({
      title: [this.data?.card.title || ''],
      description: [this.data?.card.description || ''],
      assignedTo: [this.data?.card.assignedTo || ''],
      dueDate: [this.data?.card.dueDate || ''],
      comments: this.formBuilder.array(
        (this.data?.card.comments || []).map(comment => this.formBuilder.control(comment || ''))
      )
    });
  }

  carregarUsuarios() {
    this.userService.getUsers().subscribe(users => {
      this.usuarios = users || [];
    });
  }

  salvarEdicao() {
    if (this.editForm.valid) {
      this.dialogRef.close(this.editForm.value);
    }
  }

  fecharModal() {
    this.dialogRef.close();
  }
}
