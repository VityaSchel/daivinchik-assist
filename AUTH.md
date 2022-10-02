# Авторизация в приложении

Автоматическое получение api_id и api_hash пользователя через скрин скрейпинг сайта https://my.telegram.org/

## 1. Сбор api_id и api_hash

Возможно имеет смысл поставить http-only куки `stel_ln` в значение соответствующее локализации пользователя. Без этой куки не проверялось.

### 1. Сделать POST-запрос к https://my.telegram.org/auth/send_password с телом form-data

Тело:
Формат form-data или x-www-form-urlencoded
phone: Телефон в международном формате (например +79019404698)

Возможные ответы:

200 OK 
`Content-Type: text/html; charset=UTF-8`
```
Sorry, too many tries. Please try again later.
```

200 OK
`Content-Type: application/json; charset=utf-8`
```
{"random_hash":"ajsdjnksanjkd"}
```

### 2. Сделать POST-запрос к https://my.telegram.org/auth/login

Тело:
Формат form-data или x-www-form-urlencoded
phone: Телефон в международном формате (например +79019404698)
random_hash: из ответа полученного в п. 1
password: код от Telegram
remember: 0 или 1 (влияет на Max-Age в куки stel_token)

Возможные ответы:

200 OK
`Content-Type: text/html; charset=UTF-8`
```
Invalid confirmation code!
```

200 OK
`Content-Type: application/json; charset=utf-8`
```
true
```

Если код правильный, приходит заголовок `Set-Cookie: stel_token=оченьдлинныебуквыцифры; path=/; samesite=None; secure; HttpOnly`

### 3. Сделать GET-запрос к https://my.telegram.org/apps

На этой странице и нужно искать api_id и api_hash. 

#### 3.1 Если приложение уже создано

Используйте селекторы

`[for=app_id]+div > span > strong` -> innerText для API_ID 
`[for=app_hash]+div > span` -> innerText для API_HASH

#### 3.2 Если приложение не создано

а вот тут я и сам хз что делать, удалить то нельзя, а значит для тестирования придется покупать новый аккаунт :)

## 2. Авторизоваться через MTProto как обычно