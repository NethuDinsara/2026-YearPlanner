import { useState } from 'react'
import Dashboard from './components/Dashboard'
import YearGoals from './components/YearGoals'
import MonthlyGoals from './components/MonthlyGoals'
import WeeklyPlanner from './components/WeeklyPlanner'

function App() {
  const [currentView, setCurrentView] = useState('dashboard')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const viewTitle = (view) => {
    switch(view) {
      case 'dashboard': return 'Dashboard'
      case 'yeargoals': return 'Yearly Goals'
      case 'monthlygoals': return 'Monthly Objectives'
      case 'weeklyplanner': return 'Weekly Planner'
      default: return 'Dashboard'
    }
  }

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
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <h1 className="logo">GoalStack</h1>
        <nav className="nav">
          <button 
            className={currentView === 'dashboard' ? 'nav-item active' : 'nav-item'}
            onClick={() => { setCurrentView('dashboard'); setIsSidebarOpen(false) }}
          >
            Dashboard
          </button>
          <button 
            className={currentView === 'yeargoals' ? 'nav-item active' : 'nav-item'}
            onClick={() => { setCurrentView('yeargoals'); setIsSidebarOpen(false) }}
          >
            Yearly Goals
          </button>
          <button 
            className={currentView === 'monthlygoals' ? 'nav-item active' : 'nav-item'}
            onClick={() => { setCurrentView('monthlygoals'); setIsSidebarOpen(false) }}
          >
            Monthly Objectives
          </button>
          <button 
            className={currentView === 'weeklyplanner' ? 'nav-item active' : 'nav-item'}
            onClick={() => { setCurrentView('weeklyplanner'); setIsSidebarOpen(false) }}
          >
            Weekly Planner
          </button>
        </nav>
      </aside>
      {/* overlay for mobile when sidebar is open */}
      <div className={isSidebarOpen ? 'overlay show' : 'overlay'} onClick={() => setIsSidebarOpen(false)} />
      <main className="main-content">
        <div className="mobile-header">
          <button className="hamburger" onClick={() => setIsSidebarOpen(true)} aria-label="Open navigation">☰</button>
          <div className="mobile-title">{viewTitle(currentView)}</div>
        </div>
        {renderView()}
      </main>
    </div>
  )
}

export default App