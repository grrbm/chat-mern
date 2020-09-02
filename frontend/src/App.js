import React from "react"
import JoinPage from './pages/JoinPage.js'
import ChatPage from './pages/ChatPage.js'
import PrivateRoute from './utils/PrivateRoute'
import PublicRoute from './utils/PublicRoute'
import { Switch, Route, useLocation } from "react-router-dom";
//<Route exact path="/" render={(props)=><Home id="home" {...props} />} />
function App(){

    return (
        <div id="app">
            <Switch>
                <Route exact path="/" component={JoinPage} />
                <Route exact path="/chat" component={ChatPage} />
            </Switch>
        </div>
    )
}

export default App