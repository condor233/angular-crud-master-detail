import { EntryService } from './../shared/entry.service';
import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Entry } from '../shared/entry.model';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import toastr from "toastr";

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.css']
})
export class EntryFormComponent implements OnInit, AfterContentChecked {

  currentAction: string;
  entryForm: FormGroup;
  pageTitle: string;
  serveErrorMessages: string[] = null;
  submittingForm: boolean = false;
  entry: Entry = new Entry();

  constructor(
    private service: EntryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder


    ) { }

  ngOnInit() {
    this.setCurrentAction();
    this.buildEntryForm();
    this.loadEntry();
  }

  ngAfterContentChecked(){
    this.setPageTitle();
  }

  submitForm() {
    this.submittingForm = true;

    if(this.currentAction == 'new')
      this.createEntry();
    else
      this.updateEntry();
  }

  private setCurrentAction() {
    if(this.route.snapshot.url[0].path == 'new')
      this.currentAction = 'new'
    else
      this.currentAction = 'edit'
  }

  private buildEntryForm() {
    this.entryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null],
      type: [null, [Validators.required]],
      amount: [null, [Validators.required]],
      data: [null, [Validators.required]],
      paid: [null, [Validators.required]],
      categoryId: [null, [Validators.required]]
    });
  }

  private loadEntry() {
    if (this.currentAction == 'edit') {
      this.route.paramMap.pipe(
        switchMap(params => this.service.getById(+params.get('id')))
      )
      .subscribe(
        (entry) => {
          this.entry = entry;
          this.entryForm.patchValue(entry)
        },
        (error) => alert('Ocorreu um erro no servidor, tente mais tarde.')
      )
    }

  }

  private setPageTitle() {
    if(this.currentAction == 'new')
      this.pageTitle = 'Cadastro de Novo Lançamento'
    else {
      const entryName = this.entry.name || ""
      this.pageTitle = 'Editando Lançamento: ' + entryName;
    }
  }

  private updateEntry() {
    const entry: Entry = Object.assign(new Entry(), this.entryForm.value);

    this.service.update(entry)
      .subscribe(
        entry => this.actionsForSuccess(entry),
        error => this.actionsForError(error)
      )

  }

 public createEntry() {
    const entry: Entry = Object.assign(new Entry(), this.entryForm.value);

    this.service.create(entry)
      .subscribe(
        entry => this.actionsForSuccess(entry),
        error => this.actionsForError(error)
      )
  }


  private actionsForSuccess(entry: Entry) {
    toastr.success("Solicitação processa com sucesso!")

    this.router.navigateByUrl('entries', {skipLocationChange: true}).then(
      () => this.router.navigate(['entries', entry.id, 'edit'])
    )
  }

  private actionsForError(error){
    toastr.error('Ocorreu um erro ao processar a sua solicitação!');

    this.submittingForm = false;

    if(error.status === 422) {
      this.serveErrorMessages = JSON.parse(error._body).errors;
    } else {
      this.serveErrorMessages = ["Falha na comunicação com o servidor. Por favor, tente mais tarde."]
    }
  }

}
