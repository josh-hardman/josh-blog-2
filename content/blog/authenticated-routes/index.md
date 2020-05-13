---
title: Authenticated Routes
date: "2015-05-06T23:46:37.121Z"
description: Learn how to authenticate your routes.
featuredImage: ../images/lock.jpg
---

# How do you protect authenticated routes in React Router?

Locking down protected routes can seem like a daunting task at first glance. A lot of developers get tripped up because it is not explicitly set up for you in react. Don't worry, the solution is a lot easier than you may think. You won't need to set up a middleman node server to check your JWT, or manage complex user sessions just to lock down a route in your application. **React can handle everything we need.**

In order to properly secure a route, you need to implement a "route guard" on your frontend, and authentication checks in your backend. This post will focus on implementing a front end route guard that locks the `PrivateRoute` and redirects them to the login screen. You need to build your frontend with the idea in mind that browser code can be manipulated by your users, and an attacker could send http requests directly to your backend and bypass the frontend all together.

# Interactive example:

<iframe
    src="https://codesandbox.io/embed/protected-client-side-routes-e8b0x?fontsize=14&hidenavigation=1&theme=dark"
    style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
    title="protected-client-side-routes"
    allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr"
    sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>

# Step by step

## App.js

This is the starting point for our mini react app. We wrap it with the BrowserRouter from react-router-dom, and render the NavBar, and our routes.

```js{1-2,22}{numberLines: true}
import React from "react"
import { BrowserRouter as Router } from "react-router-dom"
import NavBar from "./NavBar"
import Routes from "./Routes"

export default () => (
  <Router>
    <NavBar />
    <Routes />
  </Router>
)
```

## NavBar.js

The NavBar component will handle rendering navigation links to a public page, and a private page. It also needs to include a sign out button if the user is already logged in. We can access react router's history object with the useHistory() hook, this will enable us to programmatically redirect the user when they click "Sign out". On line 11, we check to see if the user is already authenticated. If they are, then we proceed to render the sign out button. If they click that button, then we use our fakeAuth to sign them out, and push them back to the default route. We also use Link from react router to redirect the user to /public and /protected.

```js{numberLines: true}
import React from "react"
import { useHistory, Link } from "react-router-dom"
import fakeAuth from "./fakeAuthentication"

const NavBar = () => {
  let history = useHistory()

  return (
    <>
      <p>
        {fakeAuth.isAuthenticated && (
          <button
            onClick={() => {
              fakeAuth.signout(() => history.push("/"))
            }}
          >
            Sign out
          </button>
        )}
      </p>
      <ul>
        <li>
          <Link to="/public">Public Page</Link>
        </li>
        <li>
          <Link to="/protected">Protected Page</Link>
        </li>
      </ul>
    </>
  )
}

export default NavBar
```

## Routes.js

This file simply defines our routes. /public and /login are both public routes that anyone can access, but the /protected uses the PrivateRoute component which will be in charge of locking the route down for us..

```js{numberLines: true}
import React from "react"
import { Switch, Route } from "react-router-dom"
import PrivateRoute from "./PrivateRoute"
import LoginPage from "./LoginPage"

const Routes = () => {
  return (
    <Switch>
      <Route path="/public">
        <PublicPage />
      </Route>
      <Route path="/login">
        <LoginPage />
      </Route>
      <PrivateRoute path="/protected">
        <PrivatePage />
      </PrivateRoute>
    </Switch>
  )
}

const PublicPage = () => <h1>This is the public page</h1>
const PrivatePage = () => <h1>This is a protected page</h1>

export default Routes
```

## PrivateRoute

The PrivateRoute component is where we handle protecting a route based on some client side authentication. This component takes in children and the path. The `<Route>` component takes a render prop, and we can use this to implement our "route guard". We check to see if the user is authenticated in the fakeAuthentication helper. If they are authenticated, then we just render the `<PrivatePage />` That we passed to `<PrivateRoute/>` in Routes.js. If they are not authenticated, the we use react router's `<Redirect />` component to send the user to the login screen.

```js{numberLines: true}
import React from "react"
import { Route, Redirect } from "react-router-dom"
import fakeAuth from "./fakeAuthentication"

const PrivateRoute = ({ children, path }) => {
  return (
    <Route
      path={path}
      render={({ location }) =>
        fakeAuth.isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  )
}

export default PrivateRoute
```

## fakeAuthentication.js

This little file simulates a user authentication system. In your application, this will be replace with logic that actually checks your user credentials against your backend with an authentication token. In this example, this simple service will fake an async authentication and sign out.

```js{numberLines: true}
const fakeAuth = {
  isAuthenticated: false,
  authenticate(cb) {
    fakeAuth.isAuthenticated = true
    setTimeout(cb, 100) // fake async
  },
  signout(cb) {
    fakeAuth.isAuthenticated = false
    setTimeout(cb, 100)
  },
}

export default fakeAuth
```

# Review

Now we have a simple app that has both public and private routes! To recap, we added a routes file that renders the PrivateRoute component if the user tries to access /protected. The PrivateRoute checks the fakeAuthentication file to determine if the user has authenticated. If they have, then we render the child component that was passed in, otherwise we send the user to the login screen. The NavBar just conditionally renders a sign out button if the user is authenticated and provides links to different routes on the site. Remember that this tutorial just protects your client side routes. It is essential that your backend also authenticates a user and only returns information if they are. I would be happy to write another guide on protecting backend routes.

If you found this guide to be helpful, please subscribe and stay tuned for more content!
