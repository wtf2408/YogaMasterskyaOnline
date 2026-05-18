# VideoService

ASP.NET Core 9 gRPC-сервис для загрузки видео, конвертации в HLS через FFmpeg и хранения в MinIO. gRPC порт — **8123**, HTTP — **8124**.

## Требования

- .NET 9 SDK
- PostgreSQL (локально или через Docker)
- MinIO (локально или через Docker)
- FFmpeg, установленный и доступный в `PATH`
- `dotnet ef` CLI: `dotnet tool install --global dotnet-ef`

## Первая миграция (создание таблиц)

### Вариант 1 — через Docker (рекомендуется)

Запустите только PostgreSQL из compose, затем примените миграции с локальной машины:

```bash
# из корня репозитория
docker-compose up postgres -d

cd VideoService
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
cd VideoService
dotnet ef database update
```

### Если миграций ещё нет

```bash
cd VideoService
dotnet ef migrations add InitialCreate
dotnet ef database update
```

## Запуск локально

Перед запуском убедитесь, что MinIO поднят (например через Docker):

```bash
# из корня репозитория
docker-compose up minio -d

cd VideoService
dotnet run
# gRPC: http://localhost:8123
# HTTP:  http://localhost:8124
```

## Конфигурация через переменные окружения

При запуске в Docker переменные задаются в `docker-compose.yml` и переопределяют `appsettings.json`:

| Переменная | Назначение |
|---|---|
| `ConnectionStrings__VideoServiceContext` | Строка подключения к PostgreSQL |
| `MinIO__Endpoint` | Адрес MinIO (`minio:9000` в Docker) |
| `Kestrel__Endpoints__Grpc__Url` | Адрес gRPC-эндпоинта Kestrel |
| `Kestrel__Endpoints__Http__Url` | Адрес HTTP-эндпоинта Kestrel |
