import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Api } from '../service/api';

interface category {
  id: string;
  name: string;
}

@Component({
  selector: 'app-category',
  standalone: true, 
  imports: [CommonModule, FormsModule],
  templateUrl: './category.html',
  styleUrls: ['./category.css'], 
})
export class Category { 

  categories: category[] = [];
  categoryName: string = '';
  message: string = '';
  isEditing: boolean = false;
  editingCategoryId: string | null = null;

  constructor(private apiService: Api) {}

  ngOnInit(): void {
    this.getCategories();
  }

  // GET ALL CATEGORIES
  getCategories(): void {
    this.apiService.getAllCategory().subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.categories = res.categories;
        }
      },
      error: (error) => {
        this.showMessage(error?.error?.message || error?.message || 'Unable to get all categories: ' + error);
      },
    });
  }

  // ADD A NEW CATEGORY
  addCategory(): void {
    if (!this.categoryName) {
      this.showMessage('Category name is required');
      return;
    }
    this.apiService.createCategory({ name: this.categoryName }).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.showMessage('Category added successfully');
          this.categoryName = '';
          this.getCategories();
        }
      },
      error: (error) => {
        this.showMessage(error?.error?.message || error?.message || 'Unable to save category: ' + error);
      },
    });
  }

  // EDIT CATEGORY
  editCategory(): void {
    if (!this.editingCategoryId || !this.categoryName) {
      return;
    }
    this.apiService.updateCategory(this.editingCategoryId, { name: this.categoryName }).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.showMessage('Category updated successfully');
          this.categoryName = '';
          this.isEditing = false;
          this.getCategories();
        }
      },
      error: (error) => {
        this.showMessage(error?.error?.message || error?.message || 'Unable to edit category: ' + error);
      },
    });
  }

  // SET THE CATEGORY TO EDIT
  handleEditCategory(category: category): void { // ✅ type fixed
    this.isEditing = true;
    this.editingCategoryId = category.id;
    this.categoryName = category.name;
  }

  // DELETE A CATEGORY
  handleDeleteCategory(categoryId: string): void { // ✅ spelling fixed
    if (window.confirm('Are you sure you want to delete this category?')) {
      this.apiService.deleteCategory(categoryId).subscribe({
        next: (res: any) => {
          if (res.status === 200) {
            this.showMessage('Category deleted successfully');
            this.getCategories(); // reload the category
          }
        },
        error: (error) => {
          this.showMessage(error?.error?.message || error?.message || 'Unable to delete category: ' + error);
        },
      });
    }
  }

  showMessage(message: string) {
    this.message = message;
    setTimeout(() => {
      this.message = '';
    }, 4000);
  }
}
