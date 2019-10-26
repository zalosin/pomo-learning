import React from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom'
import Container from '@material-ui/core/Container';

import PrivateRoute from './PrivateRoute';

import LoginPage from './Auth/LoginPage';
import CoursesPage from './Courses/CoursesPage';
import ProfilePage from './Profile/ProfilePage';
import ReadingTime from './ReadingTime/ReadingTime';

import './App.scss';

function App() {
  const homeRoute = localStorage.getItem('token') ? CoursesPage : LoginPage;
  return (
    <Container component="main" maxWidth="lg">
      <Router>
        <Route exact path="/" component={homeRoute} />
        <Route path="/login" component={LoginPage} />
        <PrivateRoute path="/profile" component={ProfilePage} />
        <Route path="/stats" component={ReadingTime} />
      </Router>
    </Container>
  );
}

export default App;
