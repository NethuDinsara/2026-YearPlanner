import { useState, useEffect } from 'react'
import { getYearGoals, addYearGoal, updateYearGoal, deleteYearGoal } from '../utils/storage'

function YearGoals() {
  const [goals, setGoals] = useState([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    customCategory: '',
    why: '',
    year: new Date().getFullYear().toString()
  })

  useEffect(() => {
    loadGoals()
  }, [])

  const loadGoals = () => {
    setGoals(getYearGoals())
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const categoryToSave = formData.category === 'Other' ? (formData.customCategory || '') : formData.category
    const payload = { ...formData, category: categoryToSave }
    if (editingId) {
      updateYearGoal(editingId, payload)
    } else {
      addYearGoal(payload)
    }
    resetForm()
    loadGoals()
  }

  const handleEdit = (goal) => {
    const known = ['Finance', 'Growth', 'Career', 'Relationships', 'Health']
    setFormData({
      title: goal.title,
      category: known.includes(goal.category) ? goal.category : 'Other',
      customCategory: known.includes(goal.category) ? '' : goal.category,
      why: goal.why,
      year: goal.year
    })
    setEditingId(goal.id)
    setIsFormOpen(true)
  }

  const handleDelete = (id) => {
    if (confirm('Delete this goal? All linked monthly objectives will also be deleted.')) {
      deleteYearGoal(id)
      loadGoals()
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      category: '',
      customCategory: '',
      why: '',
      year: new Date().getFullYear().toString()
    })
    setEditingId(null)
    setIsFormOpen(false)
  }

  return (
    <div className="view-container">
      <div className="view-header">
        <h1 className="view-title">Yearly Goals</h1>
        <button className="btn btn-primary" onClick={() => setIsFormOpen(!isFormOpen)}>
          {isFormOpen ? 'Cancel' : 'Add Goal'}
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
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              name="category"
              className="form-input"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            >
              <option value="">Select category</option>
              <option value="Finance">Finance</option>
              <option value="Growth">Growth</option>
              <option value="Career">Career</option>
              <option value="Relationships">Relationships</option>
              <option value="Health">Health</option>
              <option value="Other">Other (specify)</option>
            </select>

            {formData.category === 'Other' && (
              <input
                type="text"
                name="customCategory"
                className="form-input"
                placeholder="Specify category"
                value={formData.customCategory}
                onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
                required
              />
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Why</label>
            <textarea
              name="why"
              className="form-textarea"
              value={formData.why}
              onChange={handleInputChange}
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
          <p className="empty-state">No yearly goals yet. Click "Add Goal" to create one.</p>
        ) : (
          goals.map(goal => (
            <div key={goal.id} className="goal-card">
              <div className="goal-header">
                <h3 className="goal-title">{goal.title}</h3>
                <span className="goal-year">{goal.year}</span>
              </div>
              <div className="goal-category">{goal.category}</div>
              <div className="goal-why">{goal.why}</div>
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

export default YearGoals