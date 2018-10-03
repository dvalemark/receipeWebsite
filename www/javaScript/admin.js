let recipeName;
let recipePeople;
let instructionArray=[];
let ingredientArray= [];
let imageUrl;
let recipeNew;

///NAME
function addName(){
    recipeName =$('#recipeName').val();
    console.log(recipeName);
}

//ADD PEOPLE
function addPeople(){
    recipePeople=$('#nbrPeople').val();
    console.log(recipePeople);
}


//INSTRUCTIONSPART OF FORM
$('#addInstruction').click(function(){
    let instruction = $('#instruction').val();
    instructionArray = instructionArray.concat(instruction);
    console.log(instructionArray);
    console.log("hej");
    $('#instructionsAdded').append(`<li>${instruction}</li>`);
})

//INGREDIENTS PART OF FORM
$('#ingredientName').keyup(function () {
    let searchValue = $('#ingredientName').val();
    $('#ingredientAc').empty();
    console.log(searchValue);
    if (searchValue.length > 1) {
        getAutocomplete(searchValue);
    }
})

function getAutocomplete(searchValue) {
    $.get('http://localhost:3000/autocomplete-ingredient-name/' + searchValue, (data) => {
        data.forEach(listAc);
    });

}

function listAc(ingredient) {
    $('#ingredientAc').append(`<li class="list-group-item">${ingredient.Namn}</li> `);
}

$("#ingredientAc").click(function (event) {
    var target = $(event.target);
    if (target.is("li")) {
        $('#ingredientName').val(target.text());
    }
    $('#ingredientAc').empty();
});

$('#measurementSelector').on("change",function(){
    if($(this).val()==="g"){
    $('#ammountGram').val($('#ingredientAmmount').val());
}
})

////////////////////////ADDING INGREDIENTS/////////////////
$('#addIngredient').click(function(){
    let name = $('#ingredientName').val();
    let unit = $('#ingredientAmmount').val();
    let measuringUnit =$('#measurementSelector').val();
    let unitEquivalentInGrams =$('#ammountGram').val();
    
    ingredientArray = ingredientArray.concat(new Ingredient(name, unit, measuringUnit, unitEquivalentInGrams));
    console.log(ingredientArray);
    $('#ingredientsAdded').append(`<li>${name} ${unit}${measuringUnit} mängd i gram: ${unitEquivalentInGrams}</li>`);
   emptyIngredient();
});

function emptyIngredient(){
    $('#ingredientName').val('');
    $('#ingredientAmmount').val('');
    $('#measurementSelector').prop('selectedIndex',0);
    $('#ammountGram').val('');
}


///////URL ADDING
$('#addImageUrl').click(function(){
    imageUrl= $('#imageUrl').val();
})

///SEND RECIPE

$('#addRecipe').click(function(){
    let newRecipe= new AddRecipe(recipeName, recipePeople, instructionArray,ingredientArray,imageUrl);
    addRecipe(newRecipe);
})

 function addRecipe(recipe){
     //let va =JSON.stringify(recipe);
     //console.log(va);   
    $.post('http://localhost:3000/addrecipe/' + recipe, (data) => {
        
    }); 
} 