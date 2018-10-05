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
        }
    })
}


///CLEAR FORM
function emptyForm() {
    $('#recipeName').val('');
    $('#nbrPeople').val('');
    $('#measurementSelector').prop('selectedIndex', 0);
    $('#imageUrl').val('');
    $('#instructionsAdded').empty();
    $('#ingredientsAdded').empty();
}