import './App.css'
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom'
import Auth from './pages/auth'
import ExpenseTracker from './pages/expense-tracker'
function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path='/Expense-Tracker/' exact element={<Auth/>}></Route>
          <Route path='/Expense-Tracker/expense-tracker' exact element={<ExpenseTracker/>}></Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
