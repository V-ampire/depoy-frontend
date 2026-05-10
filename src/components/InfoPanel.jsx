import './InfoPanel.css'

function InfoPanel({ title, content, onClose }) {
  return (
    <div className="info-panel">
      <div className="info-panel__header">
        <span className="info-panel__title">{title}</span>
        <button className="info-panel__close" onClick={onClose}>✕</button>
      </div>
      <div className="info-panel__body">
        {content ? (
          <div
            className="info-panel__content"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          <p className="info-panel__empty">Загрузка…</p>
        )}
      </div>
    </div>
  )
}

export default InfoPanel
