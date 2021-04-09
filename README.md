### ![GA](https://cloud.githubusercontent.com/assets/40461/8183776/469f976e-1432-11e5-8199-6ac91363302b.png) General Assembly, Software Engineering Immersive

# InsBARation - Project Two

by [Hannah Akhtar](https://github.com/hannahakhtar) and [Kate Joyce](https://github.com/kate1562).

## Overview

InsBARation was a 48 hour paired hackathon, which was the second project at General Assembly's Software Engineering Immersive.

Kate and I created a cocktail website, using TheCocktailDB API. This was deployed via GitHub Pages and can be launched [here](https://hannahakhtar.github.io/project-2/).

## Project Brief

- Build a React application that consumes a public API.
- The app should have several components and include a router with several "pages".
- Be deployed online and accessible to the public.

## Technogies Used

- HTML5
- SCSS & Bulma
- JavaScript (ES6)
- React & React Router
- Babel
- Git & GitHub
- [TheCocktailDB API](https://www.thecocktaildb.com/api.php)

## Approach

We researched a number of APIs and decided to make a website showcasing cocktails and their recipes. Given this was built during a national lockdown, we thought it would be a useful website to send to our family and friends to use!

For the design, the homepage was a hero with a button for the user to view all 100 cocktails, with the name and image of these. From here, users able to click on a specific cocktail to view more information, filter by main ingredient or click on a button for a randomly generated cocktail.

Kate and I decided to pair programme as we would be doing this in industry, and below was our plan for the 48 hours:

#### Day 1 (PM)

- Choose API and use Insomnia to inspect responses
- Balsamiq for wireframe
- Create components and BrowserRouter
- Create React Hooks and state requirements

Screenshots of wireframe:

![Wireframe1 image](/assets/Wireframe1.png)
![Wireframe2 image](/assets/Wireframe2.png)

#### Day 2

- APIs
- Links and passing state between pages
- Random Cocktail generation
- Dropdown for filtering

#### Day 3 (AM)

- Styling

### Routes

Firstly, we created the routes to the various pages, using React and BrowserRouter, Switch and Route from React-Router-DOM.

```js
const App = () => {
  return <BrowserRouter>
    <Switch>
      <Route exact path="/project-2" component={Home} />
      <Route exact path="/project-2/cocktailgenerator" component={RandomCocktail} />
      <Route exact path="/project-2/allcocktails" component={Cocktails} />
      <Route exact path="/project-2/allCocktails/:cocktailId" component={Cocktail} />
    </Switch>
  </BrowserRouter>
}
```

### Components

The components created were: 

- Home
- Navbar
- Cocktails (display all cocktails)
- Cocktail (further information about individual cocktail)
- RandomCocktail (further information about randomly generated cocktail)

### Homepage

The homepage contained one button, which was a link to take the user to the All Cocktails page.

### Nav Bar

The navigation bar contained two a tags, which enabled the user to return to the home page or to the All Cocktails page.

### All cocktails

#### Data from API

We had chosen our API on the first afternoon, however once we started coding, we realised that the API was not providing the number of responses that we had expected (only 20). Therefore, I came up with an idea to reverse engineer the API using two different URLs, which would return the data we required.

To display the 100 cocktails on the allCocktails page, we used an axios request from the API within the useEffect and updated the state of the hook. Due to the issues we faced initially, the only data provided was the cocktail name, an image and a unique ID.

We needed to obtain further data about the ingredients and instructions, so we created the getCocktail function array which contained another axios request. Using the unique ID from the first request, we were able to manipulate the URL so we could request the data for each cocktail.

The function was then called in the useEffect.

```js
  useEffect(() => {
    axios.get('https://www.thecocktaildb.com/api/json/v1/1/filter.php?g=Cocktail_glass')
      .then(({ data }) => {
        updateCocktails(data.drinks)
        getCocktail(data.drinks)
      })
  }, [])

  function getCocktail(cocktails) {
    const tempArray = []

    cocktails.forEach(cocktail => {
      axios.get(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${cocktail.idDrink}`)
        .then(({ data }) => {
          const array = [...tempArray, data.drinks[0]]
          tempArray.push(data.drinks[0])
          updateAllCocktails(array)
        })
    })
    updateLoading(false)
  }
```
To display the cocktails on the page, we used the map method on the array of cocktails and these were styled as cards using Bulma. All cards were wrapped in a link so that the user was able to click on the card for more information about the individual cocktail.

#### Filter

When the user changed the select option to filter by ingredient, the useState of preference was updated. The filterCocktails function returned those cocktails which equalled the selected value.

```js
  function filterCocktails() {
    return allCocktails.filter(cocktail => {
      return (preference === 'All' || cocktail.strIngredient1 === preference || cocktail.strAlcoholic === preference)
    })
  }
  ```

###  Random cocktail generator

```js
  function goToRandom() {
    const generator = Math.floor(Math.random() * 99)
    const yourRandomCocktail = allCocktails[generator]
    return yourRandomCocktail
  }
```
The variable RandomCocktail was created and set equal to goToRandom so the state could be passed to the RandomCocktail component via the below. The goToRandom function is called when the user clicks the 'generate random cocktail' button.

```js
  <Link
    key="randombutton"
    to={{
      pathname: '/project-2/cocktailgenerator',
      state: randomCocktail
    }}>
    <button className="button is-rounded" disabled={allCocktails.length < 100} onClick={() => goToRandom()}>Generate a random cocktail</button>
  </Link>
```

### One cocktail and random cocktail pages

When the user clicks on the cocktail they want to view, as the state had been passed through to the components, we created a variable called thisCocktail, which was the specific cocktail to display.

One challenge we had with the API was the way in which it displayed the ingredients and measures. To counteract this, I used the Object.entries method to turn the object into an array. We were then able to splice the array to create two new arrays for the ingredients and measures.

Once we had this, we then used the callIngredients and callMeasures functions to only push truthy values to the allIngredients and allMeasures arrays.

The passed state and the two arrays were used to display the desired information.

This code was replicated for the random cocktail page, with slightly different naming conventions.

```js
const thisCocktail = location.state.cocktail
  const cocktailArray = Object.entries(thisCocktail)
  const rawIngredients = cocktailArray.splice(21, 15)
  const rawMeasures = cocktailArray.splice(21, 15)
  const allIngredients = []
  const allMeasures = []

  function callIngredients() {
    rawIngredients.map((ingredient) => {
      if (ingredient[1] !== null) {
        allIngredients.push(ingredient[1])
      }
    })
  }
  callIngredients()

  function callMeasures() {
    rawMeasures.map((measure) => {
      if (measure[1] !== null) {
        allMeasures.push(measure[1])
      }
    })
  }
  callMeasures()
  ```

## Victories

- Reverse engineering the API to provide the data we required
- We had only been learning React for just over a week so proud of the functionality we were able to achieve in the short timeframes.

## Challenges

- This project was the first time I had used Bulma, so it longer than anticipated for the design and due to the API challenges, we had less time for styling than planned. However, it is a great framework and can defintely see the advantages of using it for styling.

## Lessons Learned

- Given the short timeframe of the project, I learnt that value of planning throughougly and setting realistic goals i.e. a realistic MVP and then stretch goals.
- This project was a great way to understand how to pass state between pages!

## Future feature ideas

- Mobile responsive
- Add logo on Nav bar
- Update styling for individual cocktails
- Improve filtering options for all cocktails

## The Result

Home Page view:
![Home Page image](/assets/Home.png)

All cocktails view:
![All cocktails image](/assets/AllCocktails.png)

Filtering view:
![Filtered image](/assets/Filter.png)

Further information for specific cocktail:
![One cocktail image](/assets/OneCocktail.png)
