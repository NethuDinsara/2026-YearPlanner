import { useState, useEffect } from 'react'
import { getYearGoals, getMonthlyGoals } from '../utils/storage'
import { generateGoogleCalendarUrl } from '../utils/googleCalender'

function WeeklyPlanner() {
  const [yearGoals, setYearGoals] = useState([])
  const [monthlyGoals, setMonthlyGoals] = useState([])
  const [filteredMonthlyGoals, setFilteredMonthlyGoals] = useState([])
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    startTime: '',
    duration: '',
    linkedYearGoalId: '',
    linkedMonthlyGoalId: ''
  })

  useEffect(() => {
    setYearGoals(getYearGoals())
    setMonthlyGoals(getMonthlyGoals())
  }, [])

  useEffect(() => {
    if (formData.linkedYearGoalId) {
      const filtered = monthlyGoals.filter(m => m.linkedYearGoalId === formData.linkedYearGoalId)
      setFilteredMonthlyGoals(filtered)
    } else {
      setFilteredMonthlyGoals([])
    }
  }, [formData.linkedYearGoalId, monthlyGoals])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    
    if (name === 'linkedYearGoalId') {
      setFormData({
        ...formData,
        linkedYearGoalId: value,
        linkedMonthlyGoalId: ''
      })
    }
  }

  const handleAddToCalendar = (e) => {
    e.preventDefault()
    
    const yearGoal = yearGoals.find(g => g.id === formData.linkedYearGoalId)
    const monthlyGoal = monthlyGoals.find(g => g.id === formData.linkedMonthlyGoalId)
    
    const task = {
      title: formData.title,
      date: formData.date,
      startTime: formData.startTime,
      duration: parseInt(formData.duration),
      yearGoalTitle: yearGoal ? yearGoal.title : 'None',
      monthlyGoalTitle: monthlyGoal ? monthlyGoal.title : 'None'
    }
    
    const calendarUrl = generateGoogleCalendarUrl(task)
    window.open(calendarUrl, '_blank')
    
    setFormData({
      title: '',
      date: '',
      startTime: '',
      duration: '',
      linkedYearGoalId: '',
      linkedMonthlyGoalId: ''
    })
  }

  return (
    <div className="view-container">
      <h1 className="view-title">Weekly Planner</h1>

      {yearGoals.length === 0 ? (
        <div className="alert">
          Please create at least one yearly goal before planning tasks.
        </div>
      ) : (
        <form className="form-card" onSubmit={handleAddToCalendar}>
          <h2 className="form-title">Schedule Task</h2>
          
          <div className="form-group">
            <label className="form-label">Task Title</label>
            <input
              type="text"
              name="title"
              className="form-input"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                type="date"
                name="date"
                className="form-input"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Start Time</label>
              <input
                type="time"
                name="startTime"
                className="form-input"
                value={formData.startTime}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Duration (minutes)</label>
              <input
                type="number"
                name="duration"
                className="form-input"
                value={formData.duration}
                onChange={handleInputChange}
                min="1"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Linked Yearly Goal</label>
            <select
              name="linkedYearGoalId"
              className="form-select"
              value={formData.linkedYearGoalId}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a yearly goal</option>
              {yearGoals.map(goal => (
                <option key={goal.id} value={goal.id}>
                  {goal.title} ({goal.year})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Linked Monthly Objective</label>
            <select
              name="linkedMonthlyGoalId"
              className="form-select"
              value={formData.linkedMonthlyGoalId}
              onChange={handleInputChange}
              required
              disabled={!formData.linkedYearGoalId}
            >
              <option value="">Select a monthly objective</option>
              {filteredMonthlyGoals.map(goal => (
                <option key={goal.id} value={goal.id}>
                  {goal.title} ({goal.month})
                </option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Add to Google Calendar
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default WeeklyPlanner