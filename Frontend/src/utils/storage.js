const STORAGE_KEY = 'goalstack_data'

export const getStorageData = () => {
  const data = localStorage.getItem(STORAGE_KEY)
  if (!data) {
    return {
      yearGoals: [],
      monthlyGoals: []
    }
  }
  return JSON.parse(data)
}

export const saveStorageData = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export const getYearGoals = () => {
  const data = getStorageData()
  return data.yearGoals
}

export const saveYearGoals = (yearGoals) => {
  const data = getStorageData()
  data.yearGoals = yearGoals
  saveStorageData(data)
}

export const addYearGoal = (goal) => {
  const yearGoals = getYearGoals()
  yearGoals.push({ ...goal, id: Date.now().toString() })
  saveYearGoals(yearGoals)
}

export const updateYearGoal = (id, updatedGoal) => {
  const yearGoals = getYearGoals()
  const index = yearGoals.findIndex(g => g.id === id)
  if (index !== -1) {
    yearGoals[index] = { ...yearGoals[index], ...updatedGoal }
    saveYearGoals(yearGoals)
  }
}

export const deleteYearGoal = (id) => {
  const yearGoals = getYearGoals()
  const filtered = yearGoals.filter(g => g.id !== id)
  saveYearGoals(filtered)
  
  const monthlyGoals = getMonthlyGoals()
  const filteredMonthly = monthlyGoals.filter(m => m.linkedYearGoalId !== id)
  saveMonthlyGoals(filteredMonthly)
}

export const getMonthlyGoals = () => {
  const data = getStorageData()
  return data.monthlyGoals
}

export const saveMonthlyGoals = (monthlyGoals) => {
  const data = getStorageData()
  data.monthlyGoals = monthlyGoals
  saveStorageData(data)
}

export const addMonthlyGoal = (goal) => {
  const monthlyGoals = getMonthlyGoals()
  monthlyGoals.push({ ...goal, id: Date.now().toString() })
  saveMonthlyGoals(monthlyGoals)
}

export const updateMonthlyGoal = (id, updatedGoal) => {
  const monthlyGoals = getMonthlyGoals()
  const index = monthlyGoals.findIndex(g => g.id === id)
  if (index !== -1) {
    monthlyGoals[index] = { ...monthlyGoals[index], ...updatedGoal }
    saveMonthlyGoals(monthlyGoals)
  }
}

export const deleteMonthlyGoal = (id) => {
  const monthlyGoals = getMonthlyGoals()
  const filtered = monthlyGoals.filter(g => g.id !== id)
  saveMonthlyGoals(filtered)
}