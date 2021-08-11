import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import {BrowserRouter} from 'react-router-dom'
// import reportWebVitals from './reportWebVitals';

// Instalations: ESLint, Prettier, react-router-dom, props-types, styled component
// Fichiers: colors.js, prettierRC, http://localhost:3000/

ReactDOM.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
    document.getElementById('root')
  )

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// )
