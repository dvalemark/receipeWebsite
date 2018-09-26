const Recipe = require('./recipe_handler.class');


module.exports = class Routes {

  constructor(app, ingredients){
    this.app = app;
    this.ingredients = ingredients;
    this.setRoutes();
  }

  setRoutes(){
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
    this.app.get(
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
    );

        this.app.get(
          '/recipes/:partOfRecipeName',
          async (req, res) => {
            let value = req.params.partOfRecipeName.toLowerCase();
    
            if (value.length < 2) {
              res.json({ error: 'Please provide at least two characters...' });
              return;
            }
    
            let recipes = require('../json/recipe.json') || [];
            
            recipes = recipes.filter((recipe) =>{
              return recipe.name.toLowerCase().includes(value)
            })
    
            res.json(recipes);
          }
        );
      

    this.app.get(
      '/recipe-by-name/:name', 
      async (req, res) => {
        let recipe = await Recipe.readFromFile(req.params.name)
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