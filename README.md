Frontend API Documentation
Инфраструктура запросов
api.js — единый HTTP-клиент. Все запросы идут на VITE_API_URL с заголовком Authorization: Bearer {access_token}. Токены хранятся в localStorage. При получении 401 автоматически обновляет токен через POST /v1/auth/refresh-token/ (до 3 попыток) и повторяет исходный запрос.

Эндпоинты и сценарии
POST /v1/auth/login/
Сценарий: Первый запуск приложения, токены не найдены в localStorage.

AuthContext.jsx срабатывает при монтировании. Берёт window.Telegram.WebApp.initData и отправляет:


{ "raw_data": "<Telegram initData>" }
Ответ { access_token, refresh_token } сохраняется в localStorage.

POST /v1/auth/refresh-token/
Сценарий: Любой запрос вернул 401 Unauthorized — истёк access_token.

Происходит автоматически в api.js, пользователь этого не замечает.

GET /v1/groups/{groupUuid}/
Сценарий: Токены получены → GroupContext.jsx парсит URL-параметры и загружает данные группы.

URL-параметры:

uuid — UUID группы (или топика, если is_topic=true)
tg_group_uuid — UUID группы (передаётся только при is_topic=true)
is_topic — булев флаг
Ответ содержит группу с топиками и FAQ. После загрузки:

Устанавливается activeTopic (из URL или первый is_general=true)
FAQ разрешается по приоритету: topic.faq → group.faq → general_topic.faq
Данные доступны в TopicSelect, Chat, Search, Faq
GET /v1/generics/
Сценарий: Монтирование App — загружается всегда при старте.

Ответ { help_message, send_bug_message } (HTML-строки) хранится в App.jsx. Используется когда пользователь открывает "Помощь" или "Отправить баг" из бургер-меню.

POST /v1/chats/
Сценарий: Пользователь отправляет первое сообщение в чате (chatIdRef.current === null).


{
  "query": "текст сообщения",
  "tg_group_id": 123,
  "tg_topic_id": 456,
  "from_tg_message_id": null
}
Ответ содержит chat_id, который сохраняется в chatIdRef — все последующие сообщения идут уже в этот чат.

POST /v1/chats/{chatId}
Сценарий: Пользователь отправляет не первое сообщение в текущем чате (chatIdRef.current заполнен).

Тело запроса аналогично созданию чата. Ответ: { answer: { text } }.

GET /v1/chats/
Сценарий: Пользователь открывает "Мои чаты" через бургер-меню.

MyChats.jsx монтируется и загружает историю. Ответ — массив чатов с полной историей сообщений. Пользователь может выбрать чат и продолжить диалог (тогда chatIdRef устанавливается в выбранный chat_id).

GET /v1/search/{groupId}/?query={q}&tg_topic_id={topicId}
Сценарий: Пользователь на вкладке "Поиск" вводит запрос и нажимает "Найти" (или Enter).

tg_topic_id добавляется только если выбран активный топик. Ответ — массив сообщений с реакциями, датой и Telegram deep-link.

Без API-вызовов
Действие	Причина
Вкладка "FAQ"	Данные уже в GroupContext из /v1/groups/
Переключение топика в TopicSelect	Данные уже в group.topics
Оценка ответа (кнопки рейтинга)	Состояние хранится локально, на сервер не отправляется
Порядок инициализации

1. App mount
   ├─ GET /v1/generics/              (всегда)
   └─ AuthContext
       └─ POST /v1/auth/login/       (если нет токенов)
           └─ GroupContext
               └─ GET /v1/groups/{uuid}/