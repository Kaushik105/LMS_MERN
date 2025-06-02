import { Route, Routes } from "react-router-dom"
import AuthPage from "./pages/auth"

function App() {

  return (
    <>
    <div>
    <Routes>
      <Route path="/auth" element={<AuthPage/>} />
    </Routes>
    </div>
    </>
  )
}

export default App
