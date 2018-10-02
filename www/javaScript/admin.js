const ingredientArray= [];

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

$('#addIngredient').click(e=>{
    let name = $('#ingredientName').val();
    let unit = $('#ingredientAmmount').val();
    let measuringUnit =$('#measurementSelector').val();
    let unitEquivalentInGrams =$('#ammountGram').val();
    
    ingredientArray = ingredientArray.concat(new Ingredient(name, unit, measuringUnit, unitEquivalentInGrams));
    console.log(ingredientArray);
});

function prepareRecipe(){

}