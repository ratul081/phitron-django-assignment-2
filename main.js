const group = [];

const loadDefaultDrinks = async () => {
  const res = await fetch("https://www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita");
  const data = await res.json();
  displayDrinks(data.drinks.slice(0, 10));
}

// Display drinks
function displayDrinks(drinks) {
  const container = document.getElementById('drinkCards');
  container.innerHTML = '';
  drinks.forEach(drink => {
    const modalId = `modal-${drink?.idDrink}`;
    const card = document.createElement('div');
    card.className = 'col-md-6 mb-4';
    card.innerHTML = `
      <div class="card">
        <img src="${drink?.strDrinkThumb}" class="card-img-top" height="280px" alt="${drink?.strDrink}">
        <div class="card-body">
          <h5 class="card-title">${drink?.strDrink}</h5>
          <p class="card-text">Category: ${drink?.strCategory}</p>
          <p class="card-text">Instructions: ${drink?.strInstructions?.slice(0, 25)}...</p>
          <button class="btn btn-success me-2" onclick="addToGroup({idDrink: '${drink?.idDrink}', name: '${drink?.strDrink.replace(/'/g, "\\'")}'}, this)">Add to Group</button>
          <button id="meal-details-${drink?.idMeal}" type="button" class="btn btn-primary my-2" data-bs-toggle="modal"
            data-bs-target="#${modalId}">
            See full details
          </button>
        </div>
        <div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="${modalId}-label" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="${modalId}-label">${drink?.strDrink}</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <p><strong>Name:</strong> ${drink?.strDrink}</p>
                <p><strong>Category:</strong> ${drink?.strCategory}</p>
                <p><strong>Alcoholic:</strong> ${drink?.strAlcoholic}</p>
                <p><strong>Glass:</strong> ${drink?.strGlass}</p>
                <p><strong>Instructions:</strong> ${drink?.strInstructions?.slice(0, 150)}</p>
                <p><strong>Created on:</strong> ${drink?.dateModified}</p>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
      </div>`
    container.appendChild(card);
  });
}

const searchDrinks = async () => {
  const query = document.getElementById('searchInput').value;
  if (query == "") {
    loadDefaultDrinks()
  }
  else {
    const res = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${query}`);
    const data = await res.json();
    if (data.drinks) {
      displayDrinks(data.drinks);
    } else {
      document.getElementById('drinkCards').innerHTML = '<p>No drinks found.</p>';
    }
  }

}

function addToGroup(drink, button) {
  console.log(drink);

  if (group.length >= 7) {
    alert('You cannot add more than 7 drinks to the group.');
    return;
  }
  if (!group.includes(drink?.idDrink)) {
    group.push(drink?.name);

    button.disabled = true;
    updateGroupList();
  }
}

function updateGroupList() {
  const list = document.getElementById('groupList');
  list.innerHTML = '';
  group.forEach(drink => {
    const item = document.createElement('li');
    item.className = 'list-group-item';
    item.textContent = drink;
    list.appendChild(item);
  });
  document.getElementById('drinkCount').textContent = `Total Drinks: ${group.length}`;
}

loadDefaultDrinks();
