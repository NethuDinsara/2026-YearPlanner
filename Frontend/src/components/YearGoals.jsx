import { useState, useEffect } from 'react'
import { getYearGoals, addYearGoal, updateYearGoal, deleteYearGoal, getMonthlyGoals, addMonthlyGoal, updateMonthlyGoal, deleteMonthlyGoal } from '../utils/storage'

function YearGoals() {
  const [goals, setGoals] = useState([])
  const [monthlyGoals, setMonthlyGoals] = useState([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [expandedGoalId, setExpandedGoalId] = useState(null)
  const [monthlyFormGoalId, setMonthlyFormGoalId] = useState(null)
  const [editingMonthlyId, setEditingMonthlyId] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    why: '',
    year: new Date().getFullYear().toString()
  })
  const [monthlyFormData, setMonthlyFormData] = useState({
    title: '',
    month: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setGoals(getYearGoals())
    setMonthlyGoals(getMonthlyGoals())
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleMonthlyInputChange = (e) => {
    setMonthlyFormData({
      ...monthlyFormData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingId) {
      updateYearGoal(editingId, formData)
    } else {
      addYearGoal(formData)
    }
    resetForm()
    loadData()
  }

  const handleMonthlySubmit = (e) => {
    e.preventDefault()
    const monthlyData = {
      ...monthlyFormData,
      linkedYearGoalId: monthlyFormGoalId
    }
    if (editingMonthlyId) {
      updateMonthlyGoal(editingMonthlyId, monthlyData)
    } else {
      addMonthlyGoal(monthlyData)
    }
    resetMonthlyForm()
    loadData()
  }

  const handleEdit = (goal) => {
    setFormData({
      title: goal.title,
      category: goal.category,
      why: goal.why,
      year: goal.year
    })
    setEditingId(goal.id)
    setIsFormOpen(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = (id) => {
    if (confirm('Delete this goal? All linked monthly objectives will also be deleted.')) {
      deleteYearGoal(id)
      loadData()
    }
  }

  const handleEditMonthly = (monthly) => {
    setMonthlyFormData({
      title: monthly.title,
      month: monthly.month
    })
    setEditingMonthlyId(monthly.id)
    setMonthlyFormGoalId(monthly.linkedYearGoalId)
  }

  const handleDeleteMonthly = (id) => {
    if (confirm('Delete this monthly objective?')) {
      deleteMonthlyGoal(id)
      loadData()
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      category: '',
      why: '',
      year: new Date().getFullYear().toString()
    })
    setEditingId(null)
    setIsFormOpen(false)
  }

  const resetMonthlyForm = () => {
    setMonthlyFormData({
      title: '',
      month: ''
    })
    setMonthlyFormGoalId(null)
    setEditingMonthlyId(null)
  }

  const toggleExpand = (goalId) => {
    setExpandedGoalId(expandedGoalId === goalId ? null : goalId)
  }

  const getMonthlyForGoal = (goalId) => {
    return monthlyGoals.filter(m => m.linkedYearGoalId === goalId)
  }

  return (
    <div className="view-container">
      <div className="view-header">
        <h1 className="view-title">Yearly Goals</h1>
        <button className="btn btn-primary" onClick={() => setIsFormOpen(!isFormOpen)}>
          {isFormOpen ? 'Cancel' : '+ Add Goal'}
        </button>
      </div>

      {isFormOpen && (
        <form className="form-card" onSubmit={handleSubmit}>
          <h2 className="form-title">{editingId ? 'Edit Goal' : 'New Yearly Goal'}</h2>
          
          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              type="text"
              name="title"
              className="form-input"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Build a successful SaaS product"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <input
              type="text"
              name="category"
              className="form-input"
              value={formData.category}
              onChange={handleInputChange}
              placeholder="e.g., Career, Health, Personal"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Why (Your Motivation)</label>
            <textarea
              name="why"
              className="form-textarea"
              value={formData.why}
              onChange={handleInputChange}
              placeholder="Why is this goal important to you?"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Year</label>
            <input
              type="number"
              name="year"
              className="form-input"
              value={formData.year}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editingId ? 'Update Goal' : 'Create Goal'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={resetForm}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="goal-list">
        {goals.length === 0 ? (
          <p className="empty-state">No yearly goals yet. Click "Add Goal" to create one.</p>
        ) : (
          goals.map(goal => {
            const monthlyForGoal = getMonthlyForGoal(goal.id)
            const isExpanded = expandedGoalId === goal.id
            return (
              <div key={goal.id} className="goal-card-expandable">
                <div className="goal-card">
                  <div className="goal-header">
                    <h3 className="goal-title">{goal.title}</h3>
                    <span className="goal-year">{goal.year}</span>
                  </div>
                  <div className="goal-category">{goal.category}</div>
                  <div className="goal-why">{goal.why}</div>
                  <div className="goal-footer">
                    <span className="monthly-count">{monthlyForGoal.length} monthly objective{monthlyForGoal.length !== 1 ? 's' : ''}</span>
                    <div className="goal-actions">
                      <button className="btn btn-small btn-secondary" onClick={() => handleEdit(goal)}>
                        Edit
                      </button>
                      <button className="btn btn-small btn-secondary" onClick={() => toggleExpand(goal.id)}>
                        {isExpanded ? 'Collapse' : 'View Monthly'}
                      </button>
                      <button className="btn btn-small btn-danger" onClick={() => handleDelete(goal.id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="monthly-section">
                    <div className="monthly-header">
                      <h4 className="monthly-title">Monthly Objectives</h4>
                      <button 
                        className="btn btn-small btn-primary" 
                        onClick={() => setMonthlyFormGoalId(monthlyFormGoalId === goal.id ? null : goal.id)}
                      >
                        {monthlyFormGoalId === goal.id ? 'Cancel' : '+ Add Monthly'}
                      </button>
                    </div>

                    {monthlyFormGoalId === goal.id && (
                      <form className="monthly-form" onSubmit={handleMonthlySubmit}>
                        <div className="form-row">
                          <div className="form-group">
                            <label className="form-label">Title</label>
                            <input
                              type="text"
                              name="title"
                              className="form-input"
                              value={monthlyFormData.title}
                              onChange={handleMonthlyInputChange}
                              placeholder="Monthly objective title"
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Month</label>
                            <input
                              type="month"
                              name="month"
                              className="form-input"
                              value={monthlyFormData.month}
                              onChange={handleMonthlyInputChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="form-actions">
                          <button type="submit" className="btn btn-small btn-primary">
                            {editingMonthlyId ? 'Update' : 'Add'}
                          </button>
                          <button type="button" className="btn btn-small btn-secondary" onClick={resetMonthlyForm}>
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}

                    {monthlyForGoal.length === 0 ? (
                      <p className="empty-monthly">No monthly objectives yet. Click "+ Add Monthly" to create one.</p>
                    ) : (
                      <div className="monthly-list">
                        {monthlyForGoal.map(monthly => (
                          <div key={monthly.id} className="monthly-item">
                            <div className="monthly-content">
                              <span className="monthly-item-title">{monthly.title}</span>
                              <span className="monthly-item-month">{monthly.month}</span>
                            </div>
                            <div className="monthly-actions">
                              <button 
                                className="btn btn-tiny btn-secondary" 
                                onClick={() => handleEditMonthly(monthly)}
                              >
                                Edit
                              </button>
                              <button 
                                className="btn btn-tiny btn-danger" 
                                onClick={() => handleDeleteMonthly(monthly.id)}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default YearGoals