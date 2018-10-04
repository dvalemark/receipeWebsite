//search recipes function
$('#search-button').click(() => {
    let searchValue = $('#search-value').val();
    getRecipes(searchValue);
    emptyNutrients();
})

$('#search-value').keyup(function () {
    $('#result').html('');
    $('#resultAc').empty();
    let searchValue = $('#search-value').val();
    if (searchValue.length > 1) {
        getAutocomplete(searchValue);
    }
})

//get Recipes from Json-file
function getRecipes(searchValue) {
    $.get('http://localhost:3000/recipes/' + searchValue, (data) => {
        $('#search-result').empty();
        data.forEach(listRecipes);
        $('#resultAc').empty();
    });
}

function listRecipes(recipe) {
    $('#search-result').append(`<li class="searchResult" data-value="${recipe.name}">${recipe.name}</li>`);
}

//AutoComplete

$("#resultAc").click(function (event) {
    var target = $(event.target);
    if (target.is("li")) {
        $('#search-value').val(target.text());
        getRecipes(target.text());
    }
});

function getAutocomplete(searchValue) {
    $.get('http://localhost:3000/recipes/' + searchValue, (data) => {
        data.forEach(listAc);
    });

}

function listAc(recipe) {
    $('#resultAc').append(`<li class="list-group-item">${recipe.name}</li> `);
}

//FILTER///////////////////////////////////////////////////
$("#kategorier").click(function (event) {
    var target = $(event.target);
    if (target.is("a")) {
        $('#search-value').val("");
        filterCategories(target.text());
    }

});


function filterCategories(category) {
    emptyNutrients();
    
    
    $.get('http://localhost:3000/recipes-by-category/' + category, (data) => {
        $('#search-result').empty();
        data.forEach(listRecipes);
    });
}


//click on results from search
$('#search-result').click(function (event) {
    var target = $(event.target);

    if (target.is("li")) {
        getRecipeDescription(target.text());
    }
});
//SHOW RECIPE WHEN CLICKED
function getRecipeDescription(recipeName) {
    $.get('http://localhost:3000/recipeslist/' + recipeName, (data) => {
        $('#search-result').empty();
        $('#resultAc').empty();
        displayRecipe(data);
        findingNutrition(data.ingredients);
    });
}

function displayRecipe(recipeName) {
    let display = $('<section></section>');
    display.addClass('display');
    $("#search-result").append(display);

    let title = $('<h4></h4>');
    title.text(recipeName.name);
    display.append(title);

    let people = $(`<div class=row><p>Antal personer: </p><input type="number" id="changePeople" value=${recipeName.people}></div>`)
    display.append(people);

    let ingredientUlList = $('<ul></ul>');
    display.append(ingredientUlList);

    recipeName.ingredients.forEach((ingredient) => {
        let ingredientLi = $('<li></li>');
        let content= $(`<div><p>${ingredient.name}</p><p id="ammountChange">${ingredient.unit}</p><p>${ingredient.measuringUnit}</p></div>`)
        ingredientLi.append(content);
        ingredientUlList.append(ingredientLi);
    })

    let instructionsOlList = $('<ol></ol>');
    display.append(instructionsOlList);
    recipeName.instructions.forEach((instruction) => {
        let instructionLi = $('<li></li>');
        instructionLi.text(instruction);
        instructionsOlList.append(instructionLi);
    })

    let imageDisplay = $('<div></div>')
    display.append(imageDisplay);
    let image= $(`<img src="${recipeName.urlToImage}" class="img-thumbnail">`)
    imageDisplay.append(image);
    

}

//Display nutrition

function findingNutrition(ingredient) {
    ingredient.forEach((ing) => {
        getNutrition(ing);
    }
    )
}

function getNutrition(ingredient) {
    $.get('http://localhost:3000/ingredients/' + ingredient.name, (data) => {
        
        calculationNutrition(data, ingredient);
    });
}

const findNutrient = nutrientName=> (nutrient) => nutrient.Namn.toLowerCase().includes(nutrientName);

//CALCULATIONS
function calculationNutrition(nutrition, ingredient){
    let kolesterol = nutrition.Naringsvarden.Naringsvarde.find(findNutrient("kolesterol"));
    let energi = nutrition.Naringsvarden.Naringsvarde.find(findNutrient("energi"));
    let kolhydrat = nutrition.Naringsvarden.Naringsvarde.find(findNutrient("kolhydrat"));

    let multiplyToGetNutrition =parseFloat((ingredient.unitPerPerson/100).toFixed(2))
    displayCarbohydrates(kolhydrat.Varde, multiplyToGetNutrition);
    displayCholesterol(kolesterol.Varde, multiplyToGetNutrition);
    displayEnergy(energi.Varde, multiplyToGetNutrition);
}

function displayCarbohydrates(carb, multiply){
    
     prevSum =$('#sumKolhydrat').text();
     
   
   let sum = +((parseFloat(prevSum) + ((parseFloat(carb))*multiply))).toFixed(2);
    
    sum = sum.toString();
   
    $('#sumKolhydrat').text(sum.replace(".",","));
}

function displayCholesterol(chol, multiply){
    
    let prevSum =$('#sumKolesterol').text();
    console.log(chol);
    let sum = +((parseFloat(prevSum) + ((parseFloat(chol))*multiply))).toFixed(2);
    sum = sum.toString();
    $('#sumKolesterol').text((sum.replace(".", ",")));
}

function displayEnergy(ener, multiply){
    let prevSum= $('#sumEnergi').text();
    console.log(ener);
    let sum = +((parseFloat(prevSum) + ((parseFloat(ener))*multiply))).toFixed(2);
    sum = sum.toString();
    $('#sumEnergi').text(sum.replace((".", ",")));
}

function emptyNutrients(){
    $('#sumEnergi').text(0);
    $('#sumKolesterol').text(0);
    $('#sumKolhydrat').text(0);
}

///////////CALC PORTIONS
$('#changePeople').on( "change", function(){

})