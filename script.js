const searchbox = document.querySelector('.searchbox');
const searchbtn = document.querySelector('.searchbtn');
const recipecontainer = document.querySelector('.recipe-container');
const recipeclosebtn = document.querySelector('.closebtn');
const recipedetailscontent = document.querySelector('.recipe-details-content');
const wishlistIcon = document.querySelector('.wishlist');
const wishlistCount = document.querySelector('.wishlist-count');
const logoutBtn = document.querySelector('.logout-btn'); 

// Array to store liked recipes
let wishlist = [];

// Function to fetch recipes
const fetchRecipes = async (query) => {
    recipecontainer.innerHTML = "<h2>Fetching Recipes....</h2>";
    try {
        const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        const response = await data.json();

        recipecontainer.innerHTML = "";
        response.meals.forEach(meal => {
            const recipeDiv = document.createElement("div");
            recipeDiv.classList.add('recipe');
            recipeDiv.innerHTML = `
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <h3>${meal.strMeal}</h3>
                <p><span>${meal.strArea}</span> Dish</p>
                <p>Belongs to <span>${meal.strCategory}</span> Category</p>
                <button class="like-btn"><i class="fa-solid fa-heart"></i></button>
                <button>View Recipe</button>
            `;

            // View Recipe button functionality
            const viewButton = recipeDiv.querySelector('button:not(.like-btn)');
            viewButton.addEventListener('click', () => openRecipePopup(meal));

            // Like button functionality
            const likeButton = recipeDiv.querySelector('.like-btn');
            likeButton.addEventListener('click', () => toggleLikeRecipe(meal, likeButton));

            recipecontainer.appendChild(recipeDiv);
        });
    } catch (error) {
        recipecontainer.innerHTML = "<h2>Invalid recipe</h2>";
    }
};

//toggle wishlist 
const toggleLikeRecipe = (meal, likeButton) => {
    const isLiked = likeButton.classList.toggle('liked');
    if (isLiked) {
        // Add to wishlist
        wishlist.push(meal);
    } else {
        // Remove from wishlist
        wishlist = wishlist.filter(item => item.idMeal !== meal.idMeal);
    }
    updateWishlistCount();
};

// Update wishlist count in the header
const updateWishlistCount = () => {
    wishlistCount.textContent = wishlist.length;
};

// Fetch ingredients of the recipe
const fetchIngredients = (meal) => {
    let ingredientsList = "";
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        if (ingredient) {
            const measure = meal[`strMeasure${i}`];
            ingredientsList += `<li>${measure} ${ingredient}</li>`;
        } else {
            break;
        }
    }
    return ingredientsList;
};

// Display recipe details popup
const openRecipePopup = (meal) => {
    recipedetailscontent.innerHTML = `
        <h2 class="recipeName">${meal.strMeal}</h2>
        <h3>Ingredients:</h3>
        <ul class="ingredientList">${fetchIngredients(meal)}</ul>
        <div class="Instructions">
           <h3>Instructions:</h3>
           <p>${meal.strInstructions}</p>
        </div>
    `;
    recipedetailscontent.parentElement.style.display = "block";
};

// Close the recipe details popup
recipeclosebtn.addEventListener('click', () => {
    recipedetailscontent.parentElement.style.display = "none";
});

// Search for recipes when the search button is clicked
searchbtn.addEventListener('click', (e) => {
    e.preventDefault();
    const searchInput = searchbox.value.trim();
    if (!searchInput) {
        recipecontainer.innerHTML = '<h2>Type a meal in the search box...</h2>';
        return;
    }
    fetchRecipes(searchInput);
});

// Show wishlist items when the wishlist icon is clicked
wishlistIcon.addEventListener('click', () => {
    if (wishlist.length === 0) {
        alert('Your wishlist is empty!');
        return;
    }
    recipecontainer.innerHTML = "";
    wishlist.forEach(meal => {
        const recipeDiv = document.createElement("div");
        recipeDiv.classList.add('recipe');
        recipeDiv.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <h3>${meal.strMeal}</h3>
            <p><span>${meal.strArea}</span> Dish</p>
            <p>Belongs to <span>${meal.strCategory}</span> Category</p>
            <button class="remove-btn">Remove</button>
        `;

        // View Recipe button functionality
        const removeButton = recipeDiv.querySelector('.remove-btn');
        removeButton.addEventListener('click', () => removeFromWishlist(meal.idMeal, recipeDiv));

        recipecontainer.appendChild(recipeDiv);
    });
});

// Remove a recipe from the wishlist
const removeFromWishlist = (mealId, recipeDiv) => {
    wishlist = wishlist.filter(item => item.idMeal !== mealId);
    updateWishlistCount();
    recipeDiv.remove();

    if (wishlist.length === 0) {
        alert('Your wishlist is now empty!');
        window.location.href="recipe.html";
    }
};

// Logout button functionality
logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = "index.html";
});
