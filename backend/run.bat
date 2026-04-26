@echo off
set DB_HOST=localhost
set DB_USER=postgres
set DB_PASSWORD=etoya2281337
set DB_NAME=tarotdb
set DB_PORT=5432
set JWT_SECRET=tarot-secret-key-2026
set GODEBUG=netdns=cgo
set GROQ_API_KEY=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
go run cmd/server/main.go
