import { RouterProvider } from 'react-router-dom';
import {router} from './router'
import React from 'react';
import "./App.css"

export function App() {

  return (
    <RouterProvider router={router} />
  );
}
