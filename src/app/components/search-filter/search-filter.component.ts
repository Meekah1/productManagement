import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CATEGORIES } from '../../models/product.model';

@Component({
  selector: 'app-search-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.css'],
})
export class SearchFilterComponent {
  @Output() searchChange = new EventEmitter<string>();
  @Output() categoryChange = new EventEmitter<string>();
  @Output() priceRangeChange = new EventEmitter<{ min: number; max: number }>();

  categories = CATEGORIES;
  searchTerm = '';
  selectedCategory = '';
  minPrice = '';
  maxPrice = '';

  onSearch(): void {
    this.searchChange.emit(this.searchTerm);
  }

  onCategorySelect(): void {
    this.categoryChange.emit(this.selectedCategory);
  }

  onPriceRangeApply(): void {
    this.priceRangeChange.emit({
      min: this.minPrice ? Number(this.minPrice) : 0,
      max: this.maxPrice ? Number(this.maxPrice) : 10000,
    });
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.minPrice = '';
    this.maxPrice = '';
    this.searchChange.emit('');
    this.categoryChange.emit('');
    this.priceRangeChange.emit({ min: 0, max: 10000 });
  }
}
