import React from 'react';
import logo from './logo.svg';
import './App.css';
import Content from './Content';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
      </header>
      <div class="content-area">
        <Content />
      </div>
    </div>
  );
}

export default App;
