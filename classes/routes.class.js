const Recipe = require('./recipe_handler.class');

module.exports = class Routes {

  constructor(app, ingredients) {
    this.app = app;
    this.ingredients = ingredients;
    this.setRoutes();
  }

  setRoutes() {
      this.app.get(
       '/autocomplete-ingredient-name/:startOfName',
       (req, res) => {
         
         let start = req.params.startOfName.toLowerCase();
         
         if(start.length < 2){
           res.json({error: 'Please provide at least two characters...'});
           return;
         }
         
         let result = this.ingredients.filter(
           ingredient => ingredient.Namn.toLowerCase().indexOf(start) == 0
         ).map(
           ingredient => ingredient.Namn
         );
         res.json(result);
       }
     ); 

     //find nutrition
     this.app.get(
      '/ingredients/:ingredient',
      (req, res) => {
        console.log("connected to backend")
        let ingredients = req.params.ingredient.toLowerCase();
        console.log(ingredients);
        let ingredientDb = require('../json/livsmedelsdata.json') || [];

        let result= ingredientDb.find((ing) => ing.Namn.toLowerCase().includes(ingredients));
        
        res.json(result);
        
      }
    ); 

  
//find matches
    this.app.get(
      '/recipes/:partOfRecipeName',
      async (req, res) => {
        let value = req.params.partOfRecipeName.toLowerCase();

        if (value.length < 2) {
          res.json({ error: 'Please provide at least two characters...' });
          return;
        }

        let recipes = require('../json/recipe.json') || [];

        recipes = recipes.filter((recipe) => {
          return recipe.name.toLowerCase().includes(value)
        })

        res.json(recipes);
      }
    );

    //filter category
    this.app.get(
      '/recipes-by-category/:category',
      async (req, res) => {
        let valCategory = req.params.category.toLowerCase();
        let categories = require('../json/recipe.json') || [];

        categories = categories.filter((recipe) => {
          if (recipe.category.toLowerCase().includes(valCategory)) {
            return recipe.name.toLowerCase();
          }
        })
        res.json(categories);
      }
    );

//get single recipe
    this.app.get(
    '/recipeslist/:name',
    
       async (req, res) => {
        
        let value = req.params.name.toLowerCase();
        if (value.length === 0) {
          res.json({ error: 'No recipe name' });
          return;
        }
        let recipes = require('../json/recipe.json');

        let recipe = recipes.find((recipe) => recipe.name.toLowerCase().includes(value));

        res.json(recipe);
      } 
    );

    


    this.app.post(
      '/recipe',
      async (req, res) => {
        let recipe = new Recipe(req.body);
        let result = await recipe.writeToFile();
        res.json(result);
      }
    );

  }
}