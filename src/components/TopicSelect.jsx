import { useGroup } from '../context/GroupContext'
import './TopicSelect.css'

function TopicSelect() {
  const { group, activeTopic, selectTopic } = useGroup()

  const topics = group?.topics ?? []
  const hasTopics = topics.length > 0

  const handleChange = (e) => {
    const selected = topics.find((t) => t.uuid === e.target.value)
    if (selected) selectTopic(selected)
  }

  return (
    <div className="topic-select">
      <select
        className="topic-select__select"
        value={activeTopic?.uuid ?? ''}
        onChange={handleChange}
        disabled={!hasTopics}
      >
        {!hasTopics ? (
          <option value="">{group?.title ?? '—'}</option>
        ) : (
          topics.map((t) => (
            <option key={t.uuid} value={t.uuid}>
              {t.title}
            </option>
          ))
        )}
      </select>
    </div>
  )
}

export default TopicSelect
