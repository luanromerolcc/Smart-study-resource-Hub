const TYPE_ICONS = {
  video: '🎬',
  pdf: '📄',
  link: '🔗',
}

function ResourceCard({ resource, onEdit, onDelete }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      boxShadow: 'var(--shadow)',
      transition: 'var(--transition)',
      height: '280px', 
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.12)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'var(--shadow)'}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{
          background: 'var(--surface2)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          padding: '6px 10px',
          fontSize: '18px',
        }}>
          {TYPE_ICONS[resource.type] || '📎'}
        </span>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => onEdit(resource)} style={{
            background: 'transparent',
            color: 'var(--text-muted)',
            fontSize: '13px',
            padding: '4px 10px',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            transition: 'var(--transition)',
          }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            Edit
          </button>
          <button onClick={() => onDelete(resource.id)} style={{
            background: 'transparent',
            color: 'var(--text-muted)',
            fontSize: '13px',
            padding: '4px 10px',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            transition: 'var(--transition)',
          }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            Delete
          </button>
        </div>
      </div>

      {/* resource title */}
      <h3 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '15px',
        fontWeight: '700',
        color: 'var(--text)',
        lineHeight: '1.3',
      }}>
        {resource.title}
      </h3>

      {/* description */}
      <p style={{
        fontSize: '13px',
        color: 'var(--text-muted)',
        lineHeight: '1.5',
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      }}>
        {resource.description || 'No description provided.'}
      </p>

      {/* tags */}
      {resource.tags && resource.tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {resource.tags.map((tag, i) => (
            <span key={i} style={{
              background: 'var(--surface2)',
              border: '1px solid var(--border)',
              borderRadius: '20px',
              padding: '2px 10px',
              fontSize: '11px',
              color: 'var(--text-muted)',
            }}>
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* url */}
      <a href={resource.url} target="_blank" rel="noreferrer" style={{
        fontSize: '12px',
        color: 'var(--accent)',
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        marginTop: 'auto',
      }}>
        🔗 {resource.url}
      </a>
    </div>
  )
}

export default ResourceCard