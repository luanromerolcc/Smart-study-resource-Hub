import { useState, useEffect } from 'react'
import { createResource, updateResource, smartAssist } from '../services/api'

function ResourceForm({ resource, onSave, onCancel }) {
  const [title, setTitle] = useState(resource?.title || '')
  const [description, setDescription] = useState(resource?.description || '')
  const [type, setType] = useState(resource?.type || 'video')
  const [url, setUrl] = useState(resource?.url || '')
  const [tags, setTags] = useState(resource?.tags?.join(', ') || '')

  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    setTitle(resource?.title || '')
    setDescription(resource?.description || '')
    setType(resource?.type || 'video')
    setUrl(resource?.url || '')
    setTags(resource?.tags?.join(', ') || '')
  }, [resource])

  const handleSmartAssist = async () => {
    if (!title.trim()) {
      setAiError('Please enter a title before using Smart Assist.')
      return
    }

    setAiLoading(true)
    setAiError(null)

    try {
      const response = await smartAssist({ title, type })
      setDescription(response.data.description)
      setTags(response.data.tags.join(', '))
    } catch {
      setAiError('Smart Assist failed. Please try again or fill in manually.')
    } finally {
      setAiLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!title.trim() || !url.trim()) {
      setError('Title and URL are required.')
      return
    }

    setSaving(true)
    setError(null)

    const tagsArray = tags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0)

    const data = { title, description, type, url, tags: tagsArray }

    try {
      if (resource?.id) {
        await updateResource(resource.id, data)
      } else {
        await createResource(data)
      }
      onSave()
    } catch {
      setError('Failed to save resource. Please check all fields.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '20px',
    }}>
      {/* modal container */}
      <div style={{
        background: 'var(--surface)',
        borderRadius: 'var(--radius)',
        padding: '32px',
        width: '100%',
        maxWidth: '520px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}>

        {/* header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '20px',
            fontWeight: '800',
            color: 'var(--text)',
          }}>
            {resource?.id ? 'Edit Resource' : 'Add New Resource'}
          </h2>
          <button onClick={onCancel} style={{
            background: 'transparent',
            color: 'var(--text-muted)',
            fontSize: '20px',
            lineHeight: 1,
          }}>
            ✕
          </button>
        </div>

        {/* title and type row */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Title</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Intro to Algebra"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Type</label>
            <select
              value={type}
              onChange={e => setType(e.target.value)}
              style={{ ...inputStyle, width: '110px' }}
            >
              <option value="video">🎬 Video</option>
              <option value="pdf">📄 PDF</option>
              <option value="link">🔗 Link</option>
            </select>
          </div>
        </div>

        {/* smart assist button */}
        <button
          onClick={handleSmartAssist}
          disabled={aiLoading}
          style={{
            background: aiLoading ? 'var(--surface2)' : 'linear-gradient(135deg, #7c6aff, #2d6a8f)',
            color: aiLoading ? 'var(--text-muted)' : 'white',
            padding: '10px 16px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'var(--transition)',
            border: '1px solid var(--border)',
          }}
        >
          {aiLoading ? (
            <>
              <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span>
              AI is thinking...
            </>
          ) : (
            <>✨ Generate Description with AI</>
          )}
        </button>

        {/* ai error */}
        {aiError && (
          <p style={{ color: 'var(--danger)', fontSize: '13px', marginTop: '-10px' }}>
            {aiError}
          </p>
        )}

        {/* description */}
        <div>
          <label style={labelStyle}>Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Describe the resource..."
            rows={4}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </div>

        {/* url */}
        <div>
          <label style={labelStyle}>URL</label>
          <input
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://..."
            style={inputStyle}
          />
        </div>

        {/* tags */}
        <div>
          <label style={labelStyle}>Tags <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(comma separated)</span></label>
          <input
            value={tags}
            onChange={e => setTags(e.target.value)}
            placeholder="e.g. math, algebra, beginner"
            style={inputStyle}
          />
        </div>

        {/* form error */}
        {error && (
          <p style={{ color: 'var(--danger)', fontSize: '13px' }}>
            {error}
          </p>
        )}

        {/* action buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button onClick={onCancel} style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            background: 'transparent',
            color: 'var(--text-muted)',
            fontSize: '14px',
          }}>
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            style={{
              padding: '10px 24px',
              borderRadius: '8px',
              background: saving ? 'var(--text-muted)' : 'var(--accent)',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'var(--transition)',
            }}
          >
            {saving ? 'Saving...' : resource?.id ? 'Save Changes' : 'Create Resource'}
          </button>
        </div>
      </div>

      {/* spinner keyframe */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

const labelStyle = {
  display: 'block',
  fontSize: '12px',
  fontWeight: '600',
  color: 'var(--text-muted)',
  marginBottom: '6px',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
}

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: '8px',
  border: '1px solid var(--border)',
  background: 'var(--surface2)',
  color: 'var(--text)',
  fontSize: '14px',
}

export default ResourceForm