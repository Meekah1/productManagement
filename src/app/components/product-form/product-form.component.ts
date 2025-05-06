import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product, CATEGORIES, TAGS } from '../../models/product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css'],
})
export class ProductFormComponent {
  @Input() product: Partial<Product> = {
    name: '',
    sku: '',
    price: 0,
    stock: 0,
    description: '',
    tags: [],
    lowStockThreshold: 5,
  };

  @Input() isEditMode = false;
  @Output() submitForm = new EventEmitter<Partial<Product>>();
  @Output() cancel = new EventEmitter<void>();

  categories = CATEGORIES;
  availableTags = TAGS;
  selectedTags: string[] = this.product.tags || [];

  ngOnInit(): void {
    this.selectedTags = this.product.tags || [];
  }

  onSubmit(): void {
    if (!this.product.name || !this.product.sku) {
      alert('Name and SKU are required fields');
      return;
    }

    const submittedProduct = {
      ...this.product,
      price: Number(this.product.price),
      stock: Number(this.product.stock),
      tags: this.selectedTags,
      lowStockThreshold: Number(this.product.lowStockThreshold) || 5,
    };

    this.submitForm.emit(submittedProduct);
  }

  onCancel(): void {
    this.cancel.emit();
  }

  toggleTag(tag: string): void {
    if (this.selectedTags.includes(tag)) {
      this.selectedTags = this.selectedTags.filter((t) => t !== tag);
    } else {
      this.selectedTags = [...this.selectedTags, tag];
    }
  }

  isTagSelected(tag: string): boolean {
    return this.selectedTags.includes(tag);
  }
}
