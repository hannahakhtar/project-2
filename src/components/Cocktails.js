import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import RingLoader from 'react-spinners/RingLoader'
import Navbar from './Navbar'

export default function Cocktails() {
  const [cocktails, updateCocktails] = useState([])
  const [allCocktails, updateAllCocktails] = useState([])
  const [loading, updateLoading] = useState(true)
  const [preference, updatePreference] = useState('All')

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

  if (allCocktails.length < 100) {
    return <div className="loader">
      <RingLoader loading={loading} size={100} />
    </div>
  }

  function goToRandom() {
    const generator = Math.floor(Math.random() * 99)
    const yourRandomCocktail = allCocktails[generator]
    return yourRandomCocktail
  }

  function filterCocktails() {
    return allCocktails.filter(cocktail => {
      return (preference === 'All' || cocktail.strIngredient1 === preference || cocktail.strAlcoholic === preference)
    })
  }

  const randomCocktail = goToRandom()

  return <section className="allText">
    <Navbar />
    <div>
      <div className="container">
        <div className="columns">
          <div className="column">
            <Link
              key="randombutton"
              to={{
                pathname: '/project-2/cocktailgenerator',
                state: randomCocktail
              }}>
              <button className="button is-rounded" disabled={allCocktails.length < 100} onClick={() => goToRandom()}>Generate a random cocktail</button>
            </Link>
          </div>
          <div className="column">
            <p>Filter by main ingredient: </p>
            <select onChange={(event) => updatePreference(event.target.value)}>
              <option>All</option>
              <option>Vodka</option>
              <option>Gin</option>
              <option>Rum</option>
              <option>Sweet Vermouth</option>
              <option>Tequila</option>
              <option>Scotch</option>
              <option>Brandy</option>
              <option>Amaretto</option>
              <option>Non alcoholic</option>
            </select>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="container">
          <div className="columns is-multiline is-mobile">
            {filterCocktails().map((cocktail, index) => {
              return <div key={index} className="column is-one-fifth-desktop is-half-tablet is-full-mobile">
                <Link key={cocktail.idDrink} to={{
                  pathname: `/project-2/allCocktails/${cocktail.idDrink}`,
                  state: { cocktail }
                }}>
                  <div className="card">
                    <div className="card-content">
                      <div className="media">
                        <div className="media-content">
                          <h2 className="title is-6 is-centered">
                            {cocktail.strDrink.length >= 20
                              ? cocktail.strDrink.slice(0, 10) + '...'
                              : cocktail.strDrink
                            }
                          </h2>
                        </div>
                      </div>
                    </div>
                    <div className="card-image">
                      <figure className="image is 4by3">
                        <img src={cocktail.strDrinkThumb} alt={cocktail.strDrink} />
                      </figure>
                    </div>
                  </div>
                </Link>
              </div>
            })}
          </div>
        </div>
      </div>
    </div>
  </section>
}
