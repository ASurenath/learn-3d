import React from 'react';
import logo from './logo.svg';
import './App.css';
import Demo from './Demo';
import { Canvas } from '@react-three/fiber';
import DemoCanvas from './DemoCanvas';
import ThreeScene from './ThreeScene';
import Cube from './Cube';
import Cone from './Cone';
import Cone2 from './Cone2';

function App() {
  return (
    <div className="App">
      <Cone2/>
    </div>
  );
}

export default App;
