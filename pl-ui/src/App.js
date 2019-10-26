import React from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom'

import PrivateRoute from './PrivateRoute';

import LoginPage from './Auth/LoginPage';
import CoursesPage from './Courses/CoursesPage';
import ProfilePage from './Profile/ProfilePage';


function App() {
  const homeRoute = localStorage.getItem('token') ? CoursesPage : LoginPage;
  return (
    <Router>
      <div>
        <Route exact path="/" component={homeRoute} />
        <Route path="/login" component={LoginPage} />
        <PrivateRoute path="/profile" component={ProfilePage} />
      </div>
    </Router>
  );
}

export default App;
