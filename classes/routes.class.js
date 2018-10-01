const Recipe = require('./recipe_handler.class');

module.exports = class Routes {

  constructor(app, ingredients) {
    this.app = app;
    this.ingredients = ingredients;
    this.setRoutes();
  }

  setRoutes() {
    //how to search through ingredients
    /*  this.app.get(
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
     ); */
    /* this.app.get(
      '/autocomplete-recipe-name/:startOfName',
      (req, res) => {
        let value = req.params.startOfName.toLowerCase();

        if(value.lenght < 2) {
          res.json({error: 'please provide at least 2 characters.'});
          return;

        }
        let result =this.recipes.filter(
          recipe = recipe.Namn.toLowerCase().indexOf(start) == 0
        ).map(
          recipe => recipe.Namn
        );
        res.json(result);
      }
    ); */

    this.app.get('/recipeslist', (req, res) => {
      console.log("i made it! I am empty");
      res.json({ error: 'Please provide at least two characters...' });
    });

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

    this.app.get(
      '/recipes/:category',
      async (req, res) => {
        let valCategory = req.params.category.toLowerCase();
        let categories = require('../json/recipe.json') || [];

        categories = categories.filter((recipe) => {
          if (recipe.category.toLowerCase().includes(valCategory)) {
            return recipe.name.toLowerCase();
          }
        })
        res.json(recipe)
      }
    );


    this.app.get(
    '/recipeslist/:name',
    
       async (req, res) => {
        
        let value = req.params.name.toLowerCase();
        console.log("backend value ", value)
        if (value.length === 0) {
          res.json({ error: 'No recipe name' });
          return;
        }
        let recipes = require('../json/recipe.json');
        console.log("before find", recipes);

        let recipe = recipes.find((recipe) => recipe.name.toLowerCase().includes(value));
        console.log("after find", recipe);

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