# CoursesService

ASP.NET Core 8 REST API для управления курсами, уроками и пользователями. Работает на порту **5198** (или `8080` внутри Docker). Swagger доступен по корневому пути.

## Требования

- .NET 8 SDK
- PostgreSQL (локально или через Docker)
- `dotnet ef` CLI: `dotnet tool install --global dotnet-ef`

## Первая миграция (создание таблиц)

### Вариант 1 — через Docker (рекомендуется)

Запустите только PostgreSQL из compose, затем примените миграции с локальной машины:

```bash
# из корня репозитория
docker-compose up postgres -d

cd CoursesService
dotnet ef database update
```

После этого можно поднять все сервисы:

```bash
cd ..
docker-compose up -d
```

### Вариант 2 — локальный PostgreSQL

Убедитесь, что PostgreSQL запущен на `localhost:5432` с базой `YogaMasterskyaOnline`, пользователем `postgres` и паролем `admin`, затем:

```bash
cd CoursesService
dotnet ef database update
```

### Если миграций ещё нет

```bash
cd CoursesService
dotnet ef migrations add InitialCreate
dotnet ef database update
```

## Запуск локально

```bash
cd CoursesService
dotnet run
# Swagger: http://localhost:5198
```

## Конфигурация через переменные окружения

При запуске в Docker переменные задаются в `docker-compose.yml` и переопределяют `appsettings.json`:

| Переменная | Назначение |
|---|---|
| `ConnectionStrings__CoursesServiceContext` | Строка подключения к PostgreSQL |
| `VideoService__GrpcUrl` | Адрес VideoService (gRPC) |
| `CorsOrigins__0`, `CorsOrigins__1`, ... | Разрешённые CORS-origins |
