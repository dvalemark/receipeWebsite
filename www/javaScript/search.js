//search recipes function
$('#search-button').click(()  =>{
    let searchValue = $('#search-value').val();
    getRecipes(searchValue);
    
    
})

$('#search-value').keyup(function(){
    $('#result').html('');
    $('#resultAc').empty();
    let searchValue = $('#search-value').val();
    if(searchValue.length >1){
    getAutocomplete(searchValue);
    }
})

//get Recipes from Json-file
function getRecipes(searchValue){
    $.get('http://localhost:3000/recipes/' + searchValue, (data) => {
        $('#search-result').empty();
        data.forEach(listRecipes);
        $('#resultAc').empty();
    });
}

function listRecipes(recipe) {
    $('#search-result').append(`<li class="searchResult" data-value="${recipe.name}">${recipe.name}</li>` );
}

//AutoComplete

      $( "#resultAc" ).click(function( event ) {
        var target = $( event.target );
        if ( target.is( "li" ) ) {
         $('#search-value').val(target.text());
         getRecipes(target.text());
        }
      });

      function getAutocomplete(searchValue){
        $.get('http://localhost:3000/recipes/' + searchValue, (data) => {
            data.forEach(listAc);
        });
    
    }

    function listAc(recipe){
        $('#resultAc').append(`<li class="list-group-item">${recipe.name}</li> `);
    }

//click on results from search
    $('#search-result').click(function(event){
        var target = $( event.target );

        if (target.is( "li" ) ) {
        console.log(target.text());
         getRecipeDescription(target.text());
        }
    });

    function getRecipeDescription(recipeName){
        console.log("getting recipe");
        console.log(typeof(recipeName));
        console.log(recipeName);
        $.get('http://localhost:3000/recipeslist/', (data) => {
        displayRecipe(data);

        $('#search-result').empty();
        $('#resultAc').empty();
    });
    }

    function displayRecipe(recipeName){
        let display = $('<section></section>');
        display.addClass('display');

        let title = $('<h4></h4>');
        title.text(recipeName.name);
        display.append(title);

        let people= $('<p></p>')
        people.text(recipeName.people);
        display.append(people);
        
        let ingredientUlList = $('<ul></ul>');
        display.append(ingredientUlList);

        recipeName.ingredients.forEach((ingredient) => {
        let ingredientLi = $('<li></li>');
        ingredientLi.text(ingredient.name + ' ' + ingredient.units + ' ' + ingredient.measuringUnit);
        unorderedList.append(ingredientLi);
    })

    let instructionsOlList = $('<ol></ol>');
    recipeInfo.append(instructionsOlList);
    recipe.instructions.forEach((instruction) => {
        let instructionLi = $('<li></li>');
        instructionLi.text(instruction);
        orderedList.append(instructionLi);
    })

    }
    