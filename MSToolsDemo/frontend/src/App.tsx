import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SignupForm from './SignupForm'
import SignupFormSolution from './SignupFormSolution'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignupForm />} />
        <Route path="/solution" element={<SignupFormSolution />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
