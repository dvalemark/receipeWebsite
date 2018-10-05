const recipeIngredient = require('./ingredientData.class')
module.exports = class RecipeHandler {
  
  constructor(props){
      
      
      Object.assign(this, props);
    }
  
    async writeToFile(){
  }
  static createFilePath(recipeName){
    // sanitize the recipename so that it can only
    // contain the characters a-z
    // (this prevents hacks with '../' in the path
    // as well as strange characters in the path)
    recipeName = recipeName.toLowerCase().replace(/![a-z]/g,'');
    // return a file path built with path.join
    return path.join(__dirname, '../json', 'recept', recipeName + '.json');
  }
  static async readFromFile(recipeName){
    let filePath = Recipe.createFilePath(recipeName);
    let contents = await fs.readFile(filePath, 'utf-8');
    // if the file doesn't exist we get an error
    if(contents instanceof Error){
      return {error: contents};
    }
    // otherwise we get JSON data that
    // we'll convert to a Recipe instance
    let data = JSON.parse(contents);
    return new Recipe(data);
  }
  
} 