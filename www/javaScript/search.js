//search recipes function
$('#search-button').click(() => {
    let searchValue = $('#search-value').val();
    getRecipes(searchValue);
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
        console.log(target.text())
        filterCategories(target.text());
    }
});


function filterCategories(category) {
    console.log(category);
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

    let people = $(`<div class=row><p>Antal personer: </p><p>${recipeName.people}</p></div>`)
    display.append(people);

    let ingredientUlList = $('<ul></ul>');
    display.append(ingredientUlList);

    recipeName.ingredients.forEach((ingredient) => {
        let ingredientLi = $('<li></li>');
        ingredientLi.text(ingredient.name + ' ' + ingredient.units + ' ' + ingredient.measuringUnit);
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
        getNutrition(ing.name);
    }
    )
}

function getNutrition(ingredient) {
    console.log(ingredient);

    $.get('http://localhost:3000/ingredients/' + ingredient, (data) => {
        console.log(data);
        //displayingNutrition(data);
        calculationNutrition(data);
    });
}

const findNutrient = nutrientName=> (nutrient) => nutrient.Namn.toLowerCase().includes(nutrientName);

//CALCULATIONS
function calculationNutrition(nutrition){
    let kolesterol = nutrition.Naringsvarden.Naringsvarde.find(findNutrient("kolesterol"));
    let energi = nutrition.Naringsvarden.Naringsvarde.find(findNutrient("energi"));
    let kolhydrat = nutrition.Naringsvarden.Naringsvarde.find(findutrient("kolhydrat"));
    console.log(kolhydrat.Varde);
    displayCarbohydrates(kolhydrat.Varde);
    displayCholesterol(kolesterol.Varde);
    displayEnergy(energi.Varde);
}

function displayCarbohydrates(carb){
    let prevSum =$('#sumKolhydrater').text();
    let sum = (parseFloat(prevSum) + parseFloat(carb)).toFixed(2);
    $('#sumKolhydrater').text(sum);
}

function displayCholesterol(chol){
    let prevSum =$('#sumKolesterol').text();
    let sum = parseFloat(prevSum) + parseFloat(chol);
    $('#sumKolesterol').text(sum);
}

function displayEnergy(ener){
    let prevSum =$('#sumEnergi').text();
    let sum = parseFloat(prevSum) + parseFloat(ener);
    $('#sumEnergi').text(sum);
}

function displayingNutrition() {
    console.log("displaying nutrition");

}
