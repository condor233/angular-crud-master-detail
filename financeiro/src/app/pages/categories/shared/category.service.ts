import { Injectable, Injector } from '@angular/core';
import { Category } from "./category.model"

import { BaseResourceService } from 'src/app/shared/services/base-resource.service';
import { Entry } from '../../entries/shared/entry.model';
@Injectable({
  providedIn: 'root'
})
export class CategoryService extends BaseResourceService<Category> {

  constructor(protected injector: Injector) {
    super("api/categories", injector, Entry.fromJson)

  }
}
