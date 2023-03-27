import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import QuestionsPage from './pages/QuestionsPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "questions",
    element: <QuestionsPage />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  
    <RouterProvider router={router} />
    
    
 
)
