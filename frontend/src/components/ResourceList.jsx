import { useState, useEffect } from 'react'
import { getResources, deleteResource } from '../services/api'
import ResourceCard from './ResourceCard'

function ResourceList({ onAddNew, onEdit }) {
  const [resources, setResources] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchResources(currentPage)
  }, [currentPage])

  const fetchResources = async (page) => {
    setLoading(true)
    setError(null)
    try {
      const response = await getResources(page)
      setResources(response.data.results)
      setTotalPages(Math.ceil(response.data.count / 12))
    } catch (err) {
      setError('Failed to load resources. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return
    try {
      await deleteResource(id)
      fetchResources(currentPage)
    } catch (err) {
      setError('Failed to delete resource.')
    }
  }

  const filtered = resources.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* top navbar */}
      <nav style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        padding: '0 32px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        boxShadow: 'var(--shadow)',
      }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '18px',
          fontWeight: '800',
          color: 'var(--text)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          📚 STUDY HUB
        </h1>

        {/* search bar */}
        <input
          type="text"
          placeholder="Search resources by title or description..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '380px',
            padding: '9px 16px',
            borderRadius: '20px',
            border: '1px solid var(--border)',
            background: 'var(--surface2)',
            color: 'var(--text)',
            fontSize: '13px',
          }}
        />

        {/* add resource button */}
        <button onClick={onAddNew} style={{
          background: 'var(--accent)',
          color: 'white',
          padding: '9px 20px',
          borderRadius: '8px',
          fontSize: '13px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          transition: 'var(--transition)',
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-hover)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--accent)'}
        >
          + Add Resource
        </button>
      </nav>

      {/* main content */}
      <main style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>

        {/* error message */}
        {error && (
          <div style={{
            background: '#fff0f0',
            border: '1px solid var(--danger)',
            borderRadius: 'var(--radius)',
            padding: '12px 16px',
            color: 'var(--danger)',
            marginBottom: '24px',
            fontSize: '14px',
          }}>
            {error}
          </div>
        )}

        {/* loading state */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
            Loading resources...
          </div>
        )}

        {/* empty state */}
        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '32px', marginBottom: '12px' }}>📭</p>
            <p style={{ fontSize: '15px' }}>No resources found. Add your first one!</p>
          </div>
        )}

        {/* resource grid */}
        {!loading && filtered.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '20px',
            marginBottom: '32px',
          }}>
            {filtered.map(resource => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                onEdit={onEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* pagination */}
        {totalPages > 1 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            marginTop: '16px',
          }}>
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              style={{
                padding: '7px 14px',
                borderRadius: '6px',
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                color: currentPage === 1 ? 'var(--text-muted)' : 'var(--text)',
                fontSize: '13px',
              }}
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                style={{
                  padding: '7px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border)',
                  background: page === currentPage ? 'var(--accent)' : 'var(--surface)',
                  color: page === currentPage ? 'white' : 'var(--text)',
                  fontSize: '13px',
                  fontWeight: page === currentPage ? '600' : '400',
                }}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              style={{
                padding: '7px 14px',
                borderRadius: '6px',
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                color: currentPage === totalPages ? 'var(--text-muted)' : 'var(--text)',
                fontSize: '13px',
              }}
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

export default ResourceList