# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

YogaMasterskyaOnline is a monorepo with three independent projects:
- **WebClient** — React + TypeScript + Vite frontend
- **CoursesService** — ASP.NET Core 8 REST API (courses, lessons, users, auth)
- **VideoService** — ASP.NET Core 9 gRPC service (video upload, HLS conversion, MinIO storage)

## Development Commands

### Frontend (WebClient/)
```bash
npm install
npm run dev       # Dev server at http://localhost:5173
npm run build     # Production build
npm run preview   # Preview production build
```

### CoursesService (CoursesService/)
```bash
dotnet run        # Starts on http://localhost:5198; Swagger at root
dotnet build
dotnet ef migrations add <Name>   # EF Core migrations
dotnet ef database update
```

### VideoService (VideoService/)
```bash
dotnet run        # gRPC on port 8123, HTTP on port 8124
dotnet build
dotnet ef migrations add <Name>
dotnet ef database update
```

### Infrastructure (docker-compose.yml)
```bash
docker-compose up -d    # Starts VideoService + MinIO
```
MinIO console: http://localhost:9001 (minioadmin / minioadmin123)

## Architecture

### Data Flow
1. Frontend calls CoursesService REST API (port 5198) using `fetch()` with Bearer tokens.
2. CoursesService calls VideoService via gRPC (port 8123) for video operations.
3. VideoService stores HLS-converted video segments in MinIO; returns presigned URLs for playback.
4. Frontend uses [HlsPlayer.tsx](WebClient/src/app/components/HlsPlayer.tsx) (wrapping hls.js) to stream from MinIO presigned URLs.

### Database
Both services share a single PostgreSQL database (`YogaMasterskyaOnline`, port 5432, user `postgres` / password `admin`) but manage separate tables via their own EF Core DbContexts.

- CoursesService tables: `Course`, `Lesson`, `User` — see [CourceServiceContext.cs](CoursesService/Data/CourceServiceContext.cs) (note: typo in class name is intentional/existing)
- VideoService table: `VideoMappings` — see [VideoServiceDbContext.cs](VideoService/VideoServiceDbContext.cs)

### gRPC Contract
Defined in [VideoService/Protos/video_service.proto](VideoService/Protos/video_service.proto) (server) and mirrored in [CoursesService/Protos/video.proto](CoursesService/Protos/video.proto) (client). Key RPCs:
- `UploadVideo` — streaming upload, triggers FFmpeg HLS conversion (10-min segments)
- `GetPlaybackUrl` / `BatchGetPlaybackUrls` — returns MinIO presigned URLs

### Frontend State Management
No Redux/Zustand — all state lives in React hooks inside [App.tsx](WebClient/src/app/App.tsx). Routing is also managed there via local state, not React Router.

### Styling
Tailwind CSS v4 (configured via `@tailwindcss/vite` plugin in [vite.config.ts](WebClient/vite.config.ts)). Custom theme in [src/styles/theme.css](WebClient/src/styles/theme.css). Radix UI primitives wrapped in [src/app/components/ui/](WebClient/src/app/components/ui/).

## Key Configuration

| Setting | Value |
|---|---|
| Frontend origin | http://localhost:5173 |
| CoursesService | http://localhost:5198 |
| VideoService gRPC | http://localhost:8123 |
| MinIO API | http://localhost:9020 |
| PostgreSQL | localhost:5432 |

CORS in CoursesService is explicitly configured to allow `http://localhost:5173` — update [Program.cs](CoursesService/Program.cs) if the frontend port changes.

API base URL is hardcoded in frontend components as `http://localhost:5198`. Use environment variables (`import.meta.env`) if this needs to change per environment.
