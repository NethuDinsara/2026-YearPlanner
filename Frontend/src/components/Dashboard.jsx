import { useState, useEffect } from 'react'
import { getYearGoals, getMonthlyGoals } from '../utils/storage'

function Dashboard() {
  const [yearGoals, setYearGoals] = useState([])
  const [monthlyGoals, setMonthlyGoals] = useState([])

  useEffect(() => {
    setYearGoals(getYearGoals())
    setMonthlyGoals(getMonthlyGoals())
  }, [])

  const getMonthlyGoalsForYear = (yearGoalId) => {
    return monthlyGoals.filter(m => m.linkedYearGoalId === yearGoalId)
  }

  return (
    <div className="view-container">
      <h1 className="view-title">Dashboard</h1>
      
      <div className="stats">
        <div className="stat-card">
          <div className="stat-number">{yearGoals.length}</div>
          <div className="stat-label">Yearly Goals</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{monthlyGoals.length}</div>
          <div className="stat-label">Monthly Objectives</div>
        </div>
      </div>

      <div className="dashboard-section">
        <h2 className="section-title">Yearly Goals Overview</h2>
        {yearGoals.length === 0 ? (
          <p className="empty-state">No yearly goals yet. Start by adding one!</p>
        ) : (
          <div className="goal-list">
            {yearGoals.map(goal => (
              <div key={goal.id} className="goal-card">
                <div className="goal-header">
                  <h3 className="goal-title">{goal.title}</h3>
                  <span className="goal-year">{goal.year}</span>
                </div>
                <div className="goal-category">{goal.category}</div>
                <div className="goal-why">{goal.why}</div>
                <div className="goal-progress">
                  <span className="progress-label">
                    {getMonthlyGoalsForYear(goal.id).length} monthly objectives
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard