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

function getAutocomplete(searchValue){
    $.get('http://localhost:3000/recipes/' + searchValue, (data) => {
        data.forEach(listAc);
    });

}

function getRecipes(searchValue){
    $.get('http://localhost:3000/recipes/' + searchValue, (data) => {
        $('#search-result').empty();
        data.forEach(listRecipes);
            
    });
}
function listRecipes(recipe) {
    $('#search-result').append(`<h4> <a class="searchResult" href="#" data-value="${recipe.name}"> ${recipe.name}</a> </h4>`/* , `<p> ${recipe.description}</p>` */);
}
function listAc(recipe){
    $('#resultAc').append(`<li class="list-group-item"><p> ${recipe.name}</p> </li> `);
}

$('.searchResult').click(()=>{
    let showRecipe = $(this).dataset.val();
    console.log(showRecipe);
})

/* $('.searchResult').click(function( ev ){
    ev.preventDefault();
    let showRecipe = this.dataset.value;
    console.log(showRecipe); 
  });
 */
