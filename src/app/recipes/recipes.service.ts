import { Injectable } from '@angular/core';
import { Recipe } from './recipe.module';

@Injectable({
  providedIn: 'root',
})
export class RecipesService {
  recipes: Recipe[] = [
    {
      id: 'rl',
      title: 'Schmincel',
      imageUrl:
        'https://s3-media0.fl.yelpcdn.com/bphoto/ZxfvYPB2ecN3jSzTF1tPSQ/348s.jpg',
      ingredients: ['French Fries', 'Salat'],
    },
    {
      id: 'rgl',
      title: 'Spagetti',
      imageUrl:
        'https://static.femina.hu/recept/bolognai_spagetti_igy_csinaljak_az_olaszok/bolognai_spagetti.jpg',
      ingredients: ['Paste', 'Tomato'],
    },
  ];

  constructor() {}

  getAllRecipes() {
    return [...this.recipes];
  }

  getRecipe(recipeId) {
    return { ...this.recipes.find((recipe) => recipe.id === recipeId) };
  }

  deleteRecipe(recipeId: string) {
    this.recipes = this.recipes.filter((recipe) => recipe.id !== recipeId);
  }
}
