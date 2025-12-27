import { useState, useEffect } from 'react'
import { getYearGoals, getMonthlyGoals, addMonthlyGoal, updateMonthlyGoal, deleteMonthlyGoal } from '../utils/storage'

function MonthlyGoals() {
  const [goals, setGoals] = useState([])
  const [yearGoals, setYearGoals] = useState([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    month: '',
    linkedYearGoalId: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setGoals(getMonthlyGoals())
    setYearGoals(getYearGoals())
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingId) {
      updateMonthlyGoal(editingId, formData)
    } else {
      addMonthlyGoal(formData)
    }
    resetForm()
    loadData()
  }

  const handleEdit = (goal) => {
    setFormData({
      title: goal.title,
      month: goal.month,
      linkedYearGoalId: goal.linkedYearGoalId
    })
    setEditingId(goal.id)
    setIsFormOpen(true)
  }

  const handleDelete = (id) => {
    if (confirm('Delete this monthly objective?')) {
      deleteMonthlyGoal(id)
      loadData()
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      month: '',
      linkedYearGoalId: ''
    })
    setEditingId(null)
    setIsFormOpen(false)
  }

  const getYearGoalTitle = (id) => {
    const goal = yearGoals.find(g => g.id === id)
    return goal ? goal.title : 'Unknown'
  }

  return (
    <div className="view-container">
      <div className="view-header">
        <h1 className="view-title">Monthly Objectives</h1>
        <button 
          className="btn btn-primary" 
          onClick={() => setIsFormOpen(!isFormOpen)}
          disabled={yearGoals.length === 0}
        >
          {isFormOpen ? 'Cancel' : 'Add Objective'}
        </button>
      </div>

      {yearGoals.length === 0 && (
        <div className="alert">
          Please create at least one yearly goal before adding monthly objectives.
        </div>
      )}

      {isFormOpen && yearGoals.length > 0 && (
        <form className="form-card" onSubmit={handleSubmit}>
          <h2 className="form-title">{editingId ? 'Edit Objective' : 'New Monthly Objective'}</h2>
          
          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              type="text"
              name="title"
              className="form-input"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Month</label>
            <input
              type="month"
              name="month"
              className="form-input"
              value={formData.month}
              onChange={handleInputChange}
              required
            />
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

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editingId ? 'Update' : 'Create'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={resetForm}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="goal-list">
        {goals.length === 0 ? (
          <p className="empty-state">No monthly objectives yet. Click "Add Objective" to create one.</p>
        ) : (
          goals.map(goal => (
            <div key={goal.id} className="goal-card">
              <div className="goal-header">
                <h3 className="goal-title">{goal.title}</h3>
                <span className="goal-month">{goal.month}</span>
              </div>
              <div className="goal-linked">
                Linked to: {getYearGoalTitle(goal.linkedYearGoalId)}
              </div>
              <div className="goal-actions">
                <button className="btn btn-small btn-secondary" onClick={() => handleEdit(goal)}>
                  Edit
                </button>
                <button className="btn btn-small btn-danger" onClick={() => handleDelete(goal.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default MonthlyGoals