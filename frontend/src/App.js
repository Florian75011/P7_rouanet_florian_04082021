import './App.css'
import Header from './components/Header'
import Main from './components/Main'
import Footer from './components/Footer'
import { Container } from './utils/container'

// C'est l'application de la page, elle affiche chacun de ses composants (logique métier triée)
export default function App() {
  return (
    <Container as="section">
      <Header />
      <Main />
      <Footer />
    </Container>
  )
}
