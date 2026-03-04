import { useState } from 'react'
import ResourceList from './components/ResourceList'
import ResourceForm from './components/ResourceForm'

function App() {
  // controls whether the form modal is open
  const [showForm, setShowForm] = useState(false)
  // stores the resource being edited, null means we are creating a new one
  const [editingResource, setEditingResource] = useState(null)
  // used to force ResourceList to refresh after a save
  const [refreshKey, setRefreshKey] = useState(0)

  const handleAddNew = () => {
    // clear any editing resource and open the form
    setEditingResource(null)
    setShowForm(true)
  }

  const handleEdit = (resource) => {
    // set the resource to edit and open the form
    setEditingResource(resource)
    setShowForm(true)
  }

  const handleSave = () => {
    // close the form and trigger a list refresh
    setShowForm(false)
    setEditingResource(null)
    setRefreshKey(k => k + 1)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingResource(null)
  }

  return (
    <>
      {/* pass refreshKey so ResourceList re-fetches when it changes */}
      <ResourceList
        key={refreshKey}
        onAddNew={handleAddNew}
        onEdit={handleEdit}
      />

      {/* only render the form modal when showForm is true */}
      {showForm && (
        <ResourceForm
          resource={editingResource}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </>
  )
}

export default App