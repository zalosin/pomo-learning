import React from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom'

import PrivateRoute from './PrivateRoute';

import LoginPage from './Auth/LoginPage';
import CoursesPage from './Courses/CoursesPage';
import ProfilePage from './Profile/ProfilePage';
import ReadingTime from './ReadingTime/ReadingTime';

import RTETestPage from './RTETestPage'

function App() {
  const homeRoute = localStorage.getItem('token') ? CoursesPage : LoginPage;
  return (
    <Router>
      <div>
        <Route exact path="/" component={homeRoute} />
        <Route path="/login" component={LoginPage} />
        <Route path="/test" component={RTETestPage} />
        <PrivateRoute path="/profile" component={ProfilePage} />
        <Route path="/stats" component={ReadingTime} />
      </div>
    </Router>
  );
}

export default App;
