import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

// This code connects your React App component to the main index.html file's 'root' element.
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
