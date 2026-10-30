import { Component, computed, CUSTOM_ELEMENTS_SCHEMA, input, Input, output } from '@angular/core';
import { PrimaryButton } from 'src/app/shared/components/primary-button/primary-button';
import { PaginatedResponse } from '../../../interfaces/paginated-response.interface';
import { Mission } from '../../../interfaces/missions/missions.interface';

@Component({
  selector: 'app-pagination',
  imports: [PrimaryButton],
  templateUrl: './pagination.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Pagination {
  pagination = input({
    currentPage: 1,
    lastPage: 1,
    total: 0,
    perPage: 20,
    from: 0,
    to: 0
  });

  changePage = output<number>();

  pages = computed(() => {
    const current = this.pagination().currentPage;
    const last = this.pagination().lastPage;
  
    const start = Math.max(1, current - 3);
    const end = Math.min(last, current + 3);
  
    return Array.from(
      { length: end - start + 1 },
      (_, i) => start + i
    );
  });

  onChangePage(page: number){
    this.changePage.emit(page);
  }
}
