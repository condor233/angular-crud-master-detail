import { BaseResourceService } from 'src/app/shared/services/base-resource.service';
import { CategoryService } from './../../categories/shared/category.service';
import { Entry } from './entry.model';
import { Injectable, Injector } from '@angular/core';
import { catchError, flatMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';




@Injectable({
  providedIn: 'root'
})
export class EntryService extends BaseResourceService<Entry> {

  constructor(protected injector: Injector, private categoryService: CategoryService) {
    super("api/entries", injector, Entry.fromJson)
   }


  create(entry: Entry): Observable<Entry> {
    return this.setCategoryNadSendToServer(entry, super.create.bind(this))
  }

  update(entry: Entry): Observable<Entry> {
    return this.setCategoryNadSendToServer(entry, super.update.bind(this))
  }

  private setCategoryNadSendToServer(entry: Entry, sendFn: any) {
    return this.categoryService.getById(entry.categoryId).pipe(
      flatMap(category => {
        entry.category = category
        return sendFn(entry)
      }),
      catchError(this.handleError)
    );

  }

}
