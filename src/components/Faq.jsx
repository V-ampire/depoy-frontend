import { useState } from 'react'
import { useGroup } from '../context/GroupContext'
import './Faq.css'

function FaqItem({ item }) {
  const [open, setOpen] = useState(false)

  return (
    <div className={`faq__item${open ? ' faq__item--open' : ''}`}>
      <button className="faq__question" onClick={() => setOpen((v) => !v)}>
        <span>{item.question}</span>
        <span className="faq__arrow">{open ? '▲' : '▼'}</span>
      </button>
      {open && <div className="faq__answer">{item.answer}</div>}
    </div>
  )
}

function Faq() {
  const { faq, groupLoading, groupError } = useGroup()

  if (groupLoading) return <div className="faq__placeholder">Загрузка…</div>
  if (groupError) return <div className="faq__placeholder faq__placeholder--error">Не удалось загрузить FAQ</div>
  if (!faq || !faq.blocks?.length) return <div className="faq__placeholder">FAQ не найден для этой группы</div>

  return (
    <div className="faq">
      {faq.blocks.map((block, idx) => (
        <FaqItem key={idx} item={block.item} />
      ))}
    </div>
  )
}

export default Faq
