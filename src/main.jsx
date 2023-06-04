import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Routes,
  Route,
  RouterProvider,
} from "react-router-dom";
import QuestionsPage from './pages/QuestionsPage'
import IntroPage from './pages/IntroPage'
import blobBackground from "./blob.png"

const router = createBrowserRouter( 
  
  [
  {
    path: "/",
    element: <App />,
  },
  {
    path: "questions",
    element: <QuestionsPage />,
    
    
  },
]

);



ReactDOM.createRoot(document.getElementById('root')).render(

    <RouterProvider router={router} />
    
    
 
)
