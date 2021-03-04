// Third party components
import React from 'react'
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom'

// Custom components
import Users from './user/pages/Users'
import NewPlace from './places/pages/NewPlace'
import MainNavigation from './shared/components/navigation/MainNavigation'

const App = props => {
  return (
    <Router>
      <MainNavigation />
      <main >
        <Switch>  
          <Route path='/' exact>
            <Users />
          </Route>
          <Route path='/places/new'>
            <NewPlace />
          </Route>
          <Redirect to='/' />
        </Switch>
      </main>  
    </Router>
  );
}

export default App;

