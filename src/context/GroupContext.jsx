import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../services/api'
import { useAuth } from './AuthContext'

const GroupContext = createContext(null)

function parseQueryParams() {
  // const startParam = window.Telegram?.WebApp?.initDataUnsafe?.start_param
  // let params
  // if (startParam) {
  //   try {
  //     params = new URLSearchParams(atob(startParam))
  //   } catch {
  //     params = new URLSearchParams(window.location.search)
  //   }
  // } else {
  //   params = new URLSearchParams(window.location.search)
  // }
  const params = new URLSearchParams(window.location.search)
  const isTopicRaw = params.get('is_topic') ?? ''
  const isTopic = ['true', '1', 'True'].includes(isTopicRaw)
  return {
    isTopic,
    groupUuid: isTopic ? params.get('tg_group_uuid') : params.get('uuid'),
    topicUuid: isTopic ? params.get('uuid') : null,
  }
}

function resolveFaqAndTopic(group, topic, isTopic) {
  if (isTopic) {
    return { faq: topic?.faq ?? group?.faq ?? null, activeTopic: topic ?? null }
  }
  const generalTopic = (group?.topics ?? []).find((t) => t.is_general) ?? null
  const groupFaq = group?.faq?.blocks?.length ? group.faq : null
  const faq = groupFaq ?? generalTopic?.faq ?? null
  return { faq, activeTopic: generalTopic }
}

export function GroupProvider({ children }) {
  const { tokens } = useAuth()
  const [group, setGroup] = useState(null)
  const [topic, setTopic] = useState(null)
  const [faq, setFaq] = useState(null)
  const [isTopic, setIsTopic] = useState(false)
  const [activeTopic, setActiveTopic] = useState(null)
  const [groupError, setGroupError] = useState(null)
  const [groupLoading, setGroupLoading] = useState(false)
  const [groupRequestUrl, setGroupRequestUrl] = useState(null)

  useEffect(() => {
    if (!tokens) return
    const { isTopic: isTopicParam, groupUuid, topicUuid } = parseQueryParams()

    setIsTopic(isTopicParam)
    const path = groupUuid ? `/api/v1/groups/${groupUuid}/` : null
    setGroupRequestUrl(path ?? '(groupUuid отсутствует в query params)')

    if (!groupUuid) return

    setGroupLoading(true)

    api.get(path)
      .then((data) => {
        setGroup(data)
        const matchedTopic = isTopicParam
          ? (data.topics ?? []).find((t) => t.uuid === topicUuid) ?? null
          : null
        setTopic(matchedTopic)
        const { faq: resolvedFaq, activeTopic: resolvedActiveTopic } = resolveFaqAndTopic(data, matchedTopic, isTopicParam)
        setFaq(resolvedFaq)
        setActiveTopic(resolvedActiveTopic)
      })
      .catch((err) => {
        setGroupError({ message: err.message, status: err.status ?? null, groupUuid })
      })
      .finally(() => setGroupLoading(false))
  }, [tokens])

  const selectTopic = (selectedTopic) => {
    setActiveTopic(selectedTopic)
    const topicFaq = selectedTopic?.faq?.blocks?.length ? selectedTopic.faq : null
    const groupFaq = group?.faq?.blocks?.length ? group.faq : null
    setFaq(topicFaq ?? groupFaq ?? null)
  }

  return (
    <GroupContext.Provider value={{ group, topic, faq, isTopic, activeTopic, selectTopic, groupError, groupLoading, groupRequestUrl }}>
      {children}
    </GroupContext.Provider>
  )
}

export function useGroup() {
  return useContext(GroupContext)
}
