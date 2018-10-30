//PRESS NAME OF WEBSITE
$('#mumsButton').click(()=>{
    $('#search-value').empty();
    $('#search-result').empty();
    $('#nutritionSection').hide();
});

$('#adminButton').click(()=>{
    $('#search-value').empty();
})

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
        getAutocompleteRecipe(searchValue);
    }
})

//get Recipes from Json-file
function getRecipes(searchValue) {
    $('#nutritionSection').hide();
    emptyNutrients();
    $.get('http://localhost:3000/recipes/' + searchValue, (data) => {
        $('#search-result').empty();
        data.forEach(listRecipes);
    });
    $('#resultAc').empty();
}

function listRecipes(recipe) {
    $('#search-result').append(`<li class="list-group-item list-group-item-action" data-value="${recipe.name}">${recipe.name}</li>`);
}

//AutoComplete

$("#resultAc").click(function (event) {
    var target = $(event.target);
    if (target.is("li")) {
        $('#search-value').val(target.text());
        getRecipes(target.text());
    }
});

function getAutocompleteRecipe(searchValue) {
    $.get('http://localhost:3000/recipes/' + searchValue, (data) => {
        data.forEach(listAc);
    });

}

function listAc(recipe) {
    $('#resultAc').append(`<li id="resultAcIndividual" class="list-group-item">${recipe.name}</li> `);
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
    $('#nutritionSection').hide();


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
///used to recalc the recipe
let peopleCalc;

function displayRecipe(recipeName) {
    $('#nutritionSection').show();
    let display = $('<section></section>');
    display.addClass('display');
    $("#search-result").append(display);

    let imageDisplay = $('<div></div>')
    display.append(imageDisplay);
    let image = $(`<img src="${recipeName.urlToImage}" class="imageRecipe">`)
    imageDisplay.append(image);


    let title = $('<h4></h4>');
    title.text(recipeName.name);
    display.append(title);

    peopleCalc = recipeName.people;
    let people = $(`<select id="changePeople">
    <option selected value="${recipeName.people}">${recipeName.people}</option>
    <option value="1">1</option>
    <option value="2">2</option>
    <option value="4">4</option>
    <option value="8">8</option>
  </select>`)
    display.append(people);


    let ingredientTable = $('<table id="ingredientsTable"></table>');
    let tableHead = $(`<thead>
    <tr>
      <th scope="col">Namn</th>
      <th scope="col">Antal</th>
      <th scope="col">Enhet</th>
    </tr>
  </thead>`)
    ingredientTable.append(tableHead);
    let tableBody = $(`<tbody></tbody`)



    recipeName.ingredients.forEach((ingredient) => {
        let ingredientLi = $(`<tr>
        <td>${ingredient.name}</td>
        <td id="measurementCalc">${ingredient.unit}</td>
        <td>${ingredient.measuringUnit}</td>
      </tr>`);
        tableBody.append(ingredientLi);
    })
    ingredientTable.append(tableBody);
    display.append(ingredientTable);

    let instructionsOlList = $('<ol></ol>');
    let instTitle = $('<h5>Instruktioner</h5>');
    instructionsOlList.prepend(instTitle);
    display.append(instructionsOlList);
    recipeName.instructions.forEach((instruction) => {
        let instructionLi = $('<li></li>');
        instructionLi.text(instruction);
        instructionsOlList.append(instructionLi);
    })

}

//Display nutrition

function findingNutrition(ingredient) {
    ingredient.forEach((ing) => {
        getNutrition(ing);
    }
    )
}

function getNutrition(ingredient) {

    $.get('http://localhost:3000/ingredients/' + ingredient.name.replace(/%/g, '_'), (data) => {

        calculationNutrition(data, ingredient);
    });
}

const findNutrient = nutrientName => (nutrient) => nutrient.Namn.toLowerCase().includes(nutrientName);

//CALCULATIONS NUTRITION
function calculationNutrition(nutrition, ingredient) {
    let kolesterol = nutrition.Naringsvarden.Naringsvarde.find(findNutrient("kolesterol"));
    let energi = nutrition.Naringsvarden.Naringsvarde.find(findNutrient("energi"));
    let kolhydrat = nutrition.Naringsvarden.Naringsvarde.find(findNutrient("kolhydrat"));
    let fett = nutrition.Naringsvarden.Naringsvarde.find(findNutrient("fett"));
    let fettMatt = nutrition.Naringsvarden.Naringsvarde.find(findNutrient("summa mättade fettsyror"));
    let fettOmatt = nutrition.Naringsvarden.Naringsvarde.find(findNutrient("summa enkelomättade fettsyror"));
    let fettFlero = nutrition.Naringsvarden.Naringsvarde.find(findNutrient("summa fleromättade fettsyror"));
    let sackaros = nutrition.Naringsvarden.Naringsvarde.find(findNutrient("sackaros"));
    let monoSac = nutrition.Naringsvarden.Naringsvarde.find(findNutrient("monosackarider"));
    let diSac = nutrition.Naringsvarden.Naringsvarde.find(findNutrient("disackarider"));
    let salt = nutrition.Naringsvarden.Naringsvarde.find(findNutrient("salt"));

    let multiplyToGetNutrition = parseFloat((ingredient.unitPerPerson / 100).toFixed(2))
    displayFat(fett.Varde, fettMatt.Varde, fettOmatt.Varde, fettFlero.Varde, multiplyToGetNutrition);
    displaySugar(sackaros.Varde, monoSac.Varde, diSac.Varde, multiplyToGetNutrition);
    displayCarbohydrates(kolhydrat.Varde, multiplyToGetNutrition);
    displayCholesterol(kolesterol.Varde, multiplyToGetNutrition);
    displayEnergy(energi.Varde, multiplyToGetNutrition);
    displaySalt(salt.Varde, multiplyToGetNutrition);
}

function displaySalt(salt, multiply) {
    prevSumSalt = $('#sumSalt').text();

    let sum1 = +((parseFloat(prevSumSalt) + ((parseFloat(salt)) * multiply)).toFixed(2));
    sum1 = sum1.toString();
    $('#sumSalt').text((sum1.replace(".", ",")));

}

function displaySugar(sackaros, monoSac, diSac, multiply) {
    prevSumSackaros = $('#sumSackaros').text();
    prevSumMono = $('#sumMono').text();
    prevSumDi = $('#sumDi').text();

    let sum1 = +((parseFloat(prevSumSackaros) + ((parseFloat(sackaros)) * multiply)).toFixed(2));
    sum1 = sum1.toString();
    $('#sumSackaros').text((sum1.replace(".", ",")));

    let sum2 = +((parseFloat(prevSumMono) + ((parseFloat(monoSac)) * multiply)).toFixed(2));
    sum2 = sum2.toString();
    $('#sumMono').text((sum2.replace(".", ",")));

    let sum3 = +((parseFloat(prevSumDi) + ((parseFloat(diSac)) * multiply)).toFixed(2));
    sum3 = sum3.toString();
    $('#sumDi').text((sum3.replace(".", ",")));

}

function displayFat(fett, fettMatt, fettOmatt, fettFlero, multiply) {
    prevSumFett = $('#sumFett').text();
    prevSumFettMatt = $('#sumMattade').text();
    prevSumFettOmatt = $('#sumEnkel').text();
    prevSumFettFlero = $('#sumFlero').text();

    let sum1 = +((parseFloat(prevSumFett) + ((parseFloat(fett)) * multiply)).toFixed(2));
    sum1 = sum1.toString();
    $('#sumFett').text((sum1.replace(".", ",")));

    let sum2 = +((parseFloat(prevSumFettMatt) + ((parseFloat(fettMatt)) * multiply)).toFixed(2));
    sum2 = sum2.toString();
    $('#sumMattade').text((sum2.replace(".", ",")));

    let sum3 = +((parseFloat(prevSumFettOmatt) + ((parseFloat(fettOmatt)) * multiply)).toFixed(2));
    sum3 = sum3.toString();
    $('#sumEnkel').text((sum3.replace(".", ",")));

    let sum4 = +((parseFloat(prevSumFettFlero) + ((parseFloat(fettFlero)) * multiply)).toFixed(2));
    sum4 = sum4.toString();
    $('#sumFlero').text((sum4.replace(".", ",")));
}

function displayCarbohydrates(carb, multiply) {

    prevSum = $('#sumKolhydrat').text();


    let sum = +((parseFloat(prevSum) + ((parseFloat(carb)) * multiply)).toFixed(2));

    sum = sum.toString();

    $('#sumKolhydrat').text((sum.replace(".", ",")));
}

function displayCholesterol(chol, multiply) {

    let prevSum = $('#sumKolesterol').text();

    let sum = +((parseFloat(prevSum) + ((parseFloat(chol)) * multiply)).toFixed(2));

    sum = sum.toString();
    $('#sumKolesterol').text((sum.replace(".", ",")));
}

function displayEnergy(ener, multiply) {
    let prevSum = $('#sumEnergi').text();

    let sum = +((parseFloat(prevSum) + ((parseFloat(ener)) * multiply)).toFixed(2));

    sum = sum.toString();
    $('#sumEnergi').text((sum.replace(".", ",")));
}

function emptyNutrients() {
    $('#sumEnergi').text(0);
    $('#sumKolesterol').text(0);
    $('#sumKolhydrat').text(0);
    $('#sumFett').text(0);
    $('#sumMattade').text(0);
    $('#sumEnkel').text(0);
    $('#sumFlero').text(0);
    $('#sumSackaros').text(0);
    $('#sumMono').text(0);
    $('#sumDi').text(0);
    $('#sumSalt').text(0);
}

///////////CALC PORTIONS
$('#search-result').on('change', '#changePeople', function () {

    let newPeople = $('#changePeople').val();

    let change = + parseFloat((parseFloat(newPeople) / parseFloat(peopleCalc)));
    peopleCalc = newPeople;
    $('#ingredientsTable tr').each(function () {
        $(this).find('#measurementCalc').each(function () {
            let currentMeasurement = parseFloat($(this).text());
            let newMeasurement = parseFloat((Math.ceil((currentMeasurement * change) * 2) / 2).toFixed(2));
            newMeasurement = newMeasurement.toString();
            $(this).text(newMeasurement.replace((".", ",")));
        })

    })
})


//ADMIN ADD RECIPE-------------------------------------------------------------------------------------------------
let recipeName;
let recipePeople;
let category;
let instructionArray = [];
let ingredientArray = [];
let imageUrl;
let recipeNew;



///NAME
function addName() {
    recipeName = $('#recipeName').val();
    
}

//ADD PEOPLE
function addPeople() {
    recipePeople = $('#nbrPeople').val();
    
}
//ADD category
$('#categoryPicker').on("change", function () {

    category = $('#categoryPicker').val();

})

//INSTRUCTIONSPART OF FORM
$('#addInstruction').click(function () {
    let instruction = $('#instruction').val();
    if (instruction == "") {
        alert("Du måste skriva något i instruktionsrutan")
    }
    else {
        $('#instruction').val("")
        instructionArray = instructionArray.concat(instruction);
        $('#instructionsAdded').append(`<li>${instruction}</li>`);
    }
})

//INGREDIENTS PART OF FORM
$('#ingredientName').keyup(function () {
    let searchValue = $('#ingredientName').val();
    $('#ingredientAc').empty();
    
    if (searchValue.length > 1) {
        getAutocompleteIngredient(searchValue);
    }
})

function getAutocompleteIngredient(searchValue) {
    $.get('http://localhost:3000/autocomplete-ingredient-name/' + searchValue, (data) => {
        data.forEach(listAcIngredient);
    });

}

function listAcIngredient(ingredient) {
    $('#ingredientAc').append(`<li class="list-group-item">${ingredient.Namn}</li> `);
}

$("#ingredientAc").click(function (event) {
    var target = $(event.target);
    if (target.is("li")) {
        $('#ingredientName').val(target.text());
    }
    $('#ingredientAc').empty();
});

$('#measurementSelector').on("change", function () {
    if ($(this).val() === "g") {
        $('#ammountGram').val($('#ingredientAmmount').val());
    }
})

////////////////////////ADDING INGREDIENTS/////////////////
$('#addIngredient').click(function () {
    let name = $('#ingredientName').val();
    let unit = $('#ingredientAmmount').val();
    let measuringUnit = $('#measurementSelector').val();
    let unitEquivalentInGrams = $('#ammountGram').val();
    if (name == "" || unit == "" || measuringUnit == "" || unitEquivalentInGrams == "") {
        alert("Då måste fylla i alla ingrediensfälten!")
    }
    else {
 
        ingredientArray = ingredientArray.concat({
            name: name,
            unit: unit,
            measuringUnit: measuringUnit,
            unitEquivalentInGrams: unitEquivalentInGrams,
            unitPerPerson: unitEquivalentInGrams / recipePeople
        });

        
        $('#ingredientsAdded').append(`<li>${name} ${unit}${measuringUnit} mängd i gram: ${unitEquivalentInGrams}</li>`);
        emptyIngredient();
    }
});

function emptyIngredient() {
    $('#ingredientName').val('');
    $('#ingredientAmmount').val('');
    $('#measurementSelector').prop('selectedIndex', 0);
    $('#ammountGram').val('');
}


///////URL ADDING
$('#addImageUrl').click(function () {
    imageUrl = $('#imageUrl').val();
    alert("Bild tillagd!")

})

///validate
$('#addRecipe').click(function (e) {
    e.preventDefault();
    let name = $('#recipeName').val();
    let people = $('#nbrPeople').val();
    let category = $('#catgoryPicker').val();
    let instructions = $('#instructionsAdded li').val();
    let ingredients = $('#ingredientsAdded li').val();
    let imageUrl = $('#imageUrl').val();

    $(".error").remove();
    if (name === "") {
        alert('Du måste fylla i receptnamn!');
    }
    if (people === "") {
        alert('Du måste fylla i antal personer!')

    }
    if (category === "") {
        alert("Du måste välja kategori");
    }
    if (instructions === undefined) {
        alert("Du måste lägga till instruktioner")
    }
    if (ingredients === undefined) {
        alert("Du måste lägga till ingredienser!")
    }
    if (imageUrl === "") {
        alert("Du måste lägga till en bild-url!")
    }
    else (postRecipe());
});


///SEND RECIPE

function postRecipe() {
    
    let newRecipe = {
        name: recipeName,
        people: recipePeople,
        instructions: instructionArray,
        ingredients: ingredientArray,
        category: category,
        urlToImage: imageUrl
    };
    
    addRes(newRecipe);
}

function addRes(recipe) {

    $.ajax({
        url: 'http://localhost:3000/addrecipe',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(recipe),
        success: function (res) {
            alert("Receptet är tillagt")
            emptyForm();
            window.location.reload(true);
        }
    })
}


///CLEAR FORM
function emptyForm() {
    $('#recipeName').val('');
    $('#nbrPeople').val('');
    $('#measurementSelector').prop('selectedIndex', 0);
    $('#categoryPicker').prop('selectedIndex', 0);
    $('#imageUrl').val('');
    $('#instructionsAdded').empty();
    $('#ingredientsAdded').empty();
}