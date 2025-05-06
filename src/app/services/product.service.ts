import { Injectable, inject } from '@angular/core';
import { Product, CATEGORIES, TAGS } from '../models/product.model';
import { BehaviorSubject, Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly storageKey = 'products';
  private productsSubject = new BehaviorSubject<Product[]>([]);
  products$ = this.productsSubject.asObservable();

  constructor() {
    this.loadProducts();
  }

  private loadProducts(): void {
    const productsJson = localStorage.getItem(this.storageKey);
    const products = productsJson ? JSON.parse(productsJson) : [];
    this.productsSubject.next(products);
  }

  private saveProducts(products: Product[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(products));
    this.productsSubject.next(products);
  }

  getProducts(): Observable<Product[]> {
    return this.products$;
  }

  getProductById(id: string): Observable<Product | undefined> {
    return this.products$.pipe(
      map((products) => products.find((p) => p.id === id))
    );
  }

  getLowStockProducts(threshold: number = 5): Observable<Product[]> {
    return this.products$.pipe(
      map((products) =>
        products.filter((p) => p.stock <= (p.lowStockThreshold || threshold))
      )
    );
  }

  createProduct(
    product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
  ): Observable<Product> {
    const newProduct: Product = {
      ...product,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: product.tags || [],
      lowStockThreshold: product.lowStockThreshold || 5,
    };
    const updatedProducts = [...this.productsSubject.value, newProduct];
    this.saveProducts(updatedProducts);
    return of(newProduct);
  }

  updateProduct(
    id: string,
    product: Partial<Product>
  ): Observable<Product | undefined> {
    const products = [...this.productsSubject.value];
    const index = products.findIndex((p) => p.id === id);

    if (index === -1) return of(undefined);

    const updatedProduct = {
      ...products[index],
      ...product,
      updatedAt: new Date(),
    };

    products[index] = updatedProduct;
    this.saveProducts(products);
    return of(updatedProduct);
  }

  deleteProduct(id: string): Observable<boolean> {
    const products = this.productsSubject.value.filter((p) => p.id !== id);
    this.saveProducts(products);
    return of(true);
  }

  getCategories(): string[] {
    return CATEGORIES;
  }

  getTags(): string[] {
    return TAGS;
  }
}

function of<T>(value: T): Observable<T> {
  return new Observable<T>((subscriber) => {
    subscriber.next(value);
    subscriber.complete();
  });
}
