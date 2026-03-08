const search = document.getElementById("search"),
  submit = document.getElementById("submit"),
  random = document.getElementById("random"),
  resultHeading = document.getElementById("result-heading"),
  mealsEl = document.getElementById("meals"),
  single_mealEl = document.getElementById("single-meal");

/// Finding Meals
function searchMeal(e) {
  e.preventDefault();

  // Clear single meal
  single_mealEl.innerHTML = "";

  // Get search term
  const term = search.value;
  //console.log(term)

  // Check for empty
  if (term.trim()) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        resultHeading.innerHTML = `<h2>Search results for '${term}':</h2>`;

        if (data.meals === null) {
          resultHeading.innerHTML = `<p>There is no search results for '${term}'. Try again!</p>`;
        } else {
          mealsEl.innerHTML = data.meals
            .map(
              (meal) => `
            <div class="meal"> 
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
            <div class="meal-info" data-mealID="${meal.idMeal}">
            <h3>${meal.strMeal}</h3>
            </div>
            </div>
            `,
            )
            .join("");
        }
      });

    /// Clear search text
    search.value = "";
  } else {
    alert(`Please enter valid term`);
  }
}

/// Fetch meal by Id

function getMealById(mealID) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];

      addMealToDOM(meal);
    });
}

/// Fetch random meal

function getRandomMeal() {
  mealsEl.innerHTML = "";
  resultHeading.innerHTML = "";

  fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];

      addMealToDOM(meal);
    });
}

/// Adding meals to DOM

function addMealToDOM(meal) {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`,
      );
    } else {
      break;
    }
  }

  single_mealEl.innerHTML = `
      <div class="single-meal">
        <h2>${meal.strMeal}</h2>
        <img src ="${meal.strMealThumb}" alt="${meal.strMeal}"/>
        <div class="single-meal-info">
          ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ""}
          ${meal.strArea ? `<p>${meal.strArea}</p>` : ""}
        </div>
        <div class="main">
          <p>${meal.strInstructions}</p>
          <h2>Ingredients</h2>
          <ul>
            ${ingredients.map((ing) => `<li>${ing}</li>`).join()}
         </ul>
        </div>
    </div>
    `;
}

/// Adding event listeners

submit.addEventListener("submit", searchMeal);
random.addEventListener("click", getRandomMeal);

mealsEl.addEventListener("click", (e) => {
  // const mealInfo = e.path.find(item => {
  //     console.log(item)
  // })

  const mealInfo = e.composedPath().find((item) => {
    if (item.classList) {
      return item.classList.contains("meal-info");
    } else {
      return false;
    }
    // console.log(element.classList.contains('meal-info'));
  });
  // const mealId = meal.dataset.mealid

  if (mealInfo) {
    const mealId = mealInfo.getAttribute("data-mealID");
    getMealById(mealId);
  }
});
