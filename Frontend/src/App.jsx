import { useState } from 'react'
import Dashboard from './components/Dashboard'
import YearGoals from './components/YearGoals'
import MonthlyGoals from './components/MonthlyGoals'
import WeeklyPlanner from './components/WeeklyPlanner'

function App() {
  const [currentView, setCurrentView] = useState('dashboard')

  const renderView = () => {
    switch(currentView) {
      case 'dashboard':
        return <Dashboard />
      case 'yeargoals':
        return <YearGoals />
      case 'monthlygoals':
        return <MonthlyGoals />
      case 'weeklyplanner':
        return <WeeklyPlanner />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <h1 className="logo">GoalStack</h1>
        <nav className="nav">
          <button 
            className={currentView === 'dashboard' ? 'nav-item active' : 'nav-item'}
            onClick={() => setCurrentView('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={currentView === 'yeargoals' ? 'nav-item active' : 'nav-item'}
            onClick={() => setCurrentView('yeargoals')}
          >
            Yearly Goals
          </button>
          <button 
            className={currentView === 'monthlygoals' ? 'nav-item active' : 'nav-item'}
            onClick={() => setCurrentView('monthlygoals')}
          >
            Monthly Objectives
          </button>
          <button 
            className={currentView === 'weeklyplanner' ? 'nav-item active' : 'nav-item'}
            onClick={() => setCurrentView('weeklyplanner')}
          >
            Weekly Planner
          </button>
        </nav>
      </aside>
      <main className="main-content">
        {renderView()}
      </main>
    </div>
  )
}

export default App