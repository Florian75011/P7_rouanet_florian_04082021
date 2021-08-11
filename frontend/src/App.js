import './App.css'
// import { BrowserRouter } from 'react-router-dom'
import Header from './components/Header'
import Main from './components/Main'
import Footer from './components/Footer'
import { Container } from './utils/container'

// Application de la page qui affiche chaque composant
export default function App() {
  return (
      <Container as="section">
        <Header />
        <Main />
        <Footer />
      </Container>
  )
}
