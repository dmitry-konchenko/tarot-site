package main

import (
	"log"
	"os"
	"path/filepath"
	"runtime"

	"tarot-backend/internal/db"
	"tarot-backend/internal/handlers"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Ищем .env рядом с исходником, независимо от рабочей директории
	_, filename, _, _ := runtime.Caller(0)
	envPath := filepath.Join(filepath.Dir(filename), "..", "..", ".env")
	if err := godotenv.Load(envPath); err != nil {
		// fallback: пробуем из текущей директории
		if err2 := godotenv.Load(".env"); err2 != nil {
			log.Println("Warning: .env not loaded, using system env vars")
		}
	}

	log.Println("DB_NAME:", os.Getenv("DB_NAME"))
	log.Println("DB_USER:", os.Getenv("DB_USER"))

	db.Connect()

	r := gin.Default()

	r.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "http://localhost:3000")
		c.Header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	api := r.Group("/api")
	{
		api.POST("/register", handlers.Register)
		api.POST("/login", handlers.Login)
		api.POST("/reading/ask", handlers.ReadingAsk)
		api.GET("/stats", handlers.GetStats)
	}

	log.Println("Server running on :8080")
	r.Run(":8080")
}
