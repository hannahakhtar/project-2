// ? Libraries
import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
// ? Components

// ? Routes
import RandomCocktail from './components/RandomCocktail'
import Cocktails from './components/Cocktails'
import Cocktail from './components/Cocktail'
import Home from './components/Home'

// ? Styles
import 'bulma'
import './styles/style.scss'

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


export default App