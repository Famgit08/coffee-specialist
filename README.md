# Деплой проекта Coffee Specialist

## 1. Схема архитектуры
Браузер (HTTPS) -> Nginx (порт 443) -> Frontend (статика) и Backend (FastAPI).
База данных SQL Server изолирована в отдельном контейнере.

## 2. Таблица сервисов
| Сервис | Технология | Внутренний порт | Продакшен-сервер |
| :--- | :--- | :--- | :--- |
| nginx | Nginx | 80, 443 | - |
| frontend | Nginx (статика) | 80 | - |
| backend | Python / FastAPI | 8000 | Uvicorn (без --reload) |
| db | MS SQL Server | 1433 | - |

## 3. Переменные окружения и секреты
**Backend (переменные):**
* DB_SERVER, DB_NAME, DB_USER, DB_PASSWORD
**Секреты (файлы):**
* coffee.localhost.pem, coffee.localhost-key.pem

## 4. Команды
* Запуск: `docker compose up -d --build`
* Остановка: `docker compose down`

## 5. Скриншоты
В папке Screenshots

## 6. Ошибки и их решения
* **Ошибка:** `Login timeout expired` при подключении к БД.
  **Решение:** Перенес БД в контейнер и настроил сеть Docker, изменил `DB_SERVER` на `db,1433`.
* **Ошибка:** `SSPI Provider: No credentials` .
  **Решение:** Заменил `Trusted_Connection` на логин/пароль `sa` в `database.py`.
* **Ошибка:** `nginx:alpine: no such host`.
  **Решение:** Перезапустил Docker Desktop для обновления DNS.

## 7. Что нужно для реального сервера?
Аренда VPS, покупка домена, получение сертификата Let's Encrypt, настройка CD в GitHub Actions.
