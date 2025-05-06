import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { ProductFormComponent } from '../product-form/product-form.component';
import { SearchFilterComponent } from '../search-filter/search-filter.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    ProductFormComponent,
    SearchFilterComponent,
    RouterModule,
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  showForm = false;
  currentProduct: Partial<Product> | null = null;
  isEditMode = false;
  lowStockProducts: Product[] = [];
  searchTerm = '';
  selectedCategory = '';
  priceRange = { min: 0, max: 1000 };

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe((products) => {
      this.products = products;
      this.filteredProducts = products;
      this.updateLowStockProducts();
    });
  }

  updateLowStockProducts(): void {
    this.productService.getLowStockProducts().subscribe((products) => {
      this.lowStockProducts = products;
    });
  }

  showAddForm(): void {
    this.currentProduct = {
      name: '',
      sku: '',
      price: 0,
      stock: 0,
      description: '',
      tags: [],
      lowStockThreshold: 5,
    };
    this.isEditMode = false;
    this.showForm = true;
  }

  showEditForm(product: Product): void {
    this.currentProduct = { ...product };
    this.isEditMode = true;
    this.showForm = true;
  }

  handleFormSubmit(productData: Partial<Product>): void {
    if (this.isEditMode && this.currentProduct?.id) {
      this.productService
        .updateProduct(this.currentProduct.id, productData)
        .subscribe(() => {
          this.loadProducts();
          this.resetForm();
        });
    } else {
      const completeProductData: Omit<
        Product,
        'id' | 'createdAt' | 'updatedAt'
      > = {
        name: productData.name || '',
        sku: productData.sku || '',
        price: productData.price || 0,
        stock: productData.stock || 0,
        description: productData.description || '',
        tags: productData.tags || [],
        lowStockThreshold: productData.lowStockThreshold || 5,
        category: productData.category || '',
      };

      this.productService.createProduct(completeProductData).subscribe(() => {
        this.loadProducts();
        this.resetForm();
      });
    }
  }

  handleFormCancel(): void {
    this.resetForm();
  }

  resetForm(): void {
    this.showForm = false;
    this.currentProduct = null;
    this.isEditMode = false;
  }

  deleteProduct(id: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe(() => {
        this.loadProducts();
      });
    }
  }

  applyFilters(): void {
    this.filteredProducts = this.products.filter((product) => {
      const matchesSearch =
        !this.searchTerm ||
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesCategory =
        !this.selectedCategory || product.category === this.selectedCategory;

      const matchesPrice =
        product.price >= this.priceRange.min &&
        product.price <= this.priceRange.max;

      return matchesSearch && matchesCategory && matchesPrice;
    });
  }

  onSearchChange(term: string): void {
    this.searchTerm = term;
    this.applyFilters();
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
    this.applyFilters();
  }

  onPriceRangeChange(range: { min: number; max: number }): void {
    this.priceRange = range;
    this.applyFilters();
  }

  getStockClass(stock: number, threshold: number = 5): string {
    return stock <= threshold ? 'low-stock' : '';
  }
}
