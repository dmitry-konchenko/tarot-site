package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"os/exec"
	"strings"

	"tarot-backend/internal/db"
	"tarot-backend/internal/models"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

type readingRequest struct {
	Spread   string   `json:"spread" binding:"required"`
	Question string   `json:"question" binding:"required"`
	Cards    []string `json:"cards" binding:"required"`
}

func ReadingAsk(c *gin.Context) {
	var req readingRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Укажите расклад, вопрос и карты"})
		return
	}

	userID := getUserID(c)

	reading := models.Reading{
		UserID:   userID,
		Spread:   req.Spread,
		Question: req.Question,
		Cards:    strings.Join(req.Cards, ", "),
	}
	db.DB.Create(&reading)

	prompt := buildPrompt(req.Spread, req.Question, req.Cards)

	text, err := callGroq(prompt)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"text": text})
}

func GetStats(c *gin.Context) {
	userID := getUserID(c)

	var total int64
	db.DB.Model(&models.Reading{}).Where("user_id = ?", userID).Count(&total)

	var readings []models.Reading
	db.DB.Where("user_id = ?", userID).
		Order("created_at desc").
		Limit(5).
		Find(&readings)

	// Самый частый расклад
	type result struct {
		Spread string
		Count  int
	}
	var topSpread result
	db.DB.Model(&models.Reading{}).
		Select("spread, count(*) as count").
		Where("user_id = ?", userID).
		Group("spread").
		Order("count desc").
		Limit(1).
		Scan(&topSpread)

	c.JSON(http.StatusOK, gin.H{
		"total":      total,
		"top_spread": topSpread.Spread,
		"recent":     readings,
	})
}

// ---------- helpers ----------

func getUserID(c *gin.Context) uint {
	authHeader := c.GetHeader("Authorization")
	if !strings.HasPrefix(authHeader, "Bearer ") {
		return 0
	}
	tokenStr := strings.TrimPrefix(authHeader, "Bearer ")
	token, err := jwt.Parse(tokenStr, func(t *jwt.Token) (interface{}, error) {
		secret := os.Getenv("JWT_SECRET")
		if secret == "" {
			secret = "dev-secret-change-in-prod"
		}
		return []byte(secret), nil
	})
	if err != nil || !token.Valid {
		return 0
	}
	claims := token.Claims.(jwt.MapClaims)
	id, _ := claims["user_id"].(float64)
	return uint(id)
}

func buildPrompt(spread, question string, cards []string) string {
	cardList := strings.Join(cards, ", ")
	return fmt.Sprintf(`Ты — мудрая гадалка, которая делает расклад Таро. Отвечай на русском языке, атмосферно и загадочно, но по делу. Не более 200 слов.

Расклад: %s
Вопрос клиента: %s
Выпавшие карты: %s

Истолкуй эти карты применительно к вопросу клиента.`, spread, question, cardList)
}

func callGroq(prompt string) (string, error) {
	apiKey := strings.TrimSpace(os.Getenv("GROQ_API_KEY"))

	// Записываем тело запроса во временный файл — избегаем проблем с экранированием
	reqBody := map[string]interface{}{
		"model":  "llama-3.1-8b-instant",
		"stream": false,
		"messages": []map[string]string{
			{"role": "user", "content": prompt},
		},
	}
	reqBytes, _ := json.Marshal(reqBody)

	tmpFile, err := os.CreateTemp("", "groq-*.json")
	if err != nil {
		return "", err
	}
	defer os.Remove(tmpFile.Name())
	tmpFile.Write(reqBytes)
	tmpFile.Close()

	outFile, err := os.CreateTemp("", "groq-out-*.txt")
	if err != nil {
		return "", err
	}
	outPath := outFile.Name()
	outFile.Close()
	defer os.Remove(outPath)

	psScript := fmt.Sprintf(`
$body = Get-Content -Path '%s' -Raw -Encoding UTF8
$bodyBytes = [System.Text.Encoding]::UTF8.GetBytes($body)
$client = New-Object Net.WebClient
$client.Headers.Add("Authorization", "Bearer %s")
$client.Headers.Add("Content-Type", "application/json")
$bytes = $client.UploadData("https://api.groq.com/openai/v1/chat/completions", "POST", $bodyBytes)
[System.IO.File]::WriteAllBytes('%s', $bytes)
`, tmpFile.Name(), apiKey, outPath)

	cmd := exec.Command("powershell", "-NoProfile", "-NonInteractive", "-Command", psScript)
	errOut, err := cmd.CombinedOutput()
	if err != nil {
		return "", fmt.Errorf("powershell error: %w — %s", err, string(errOut))
	}

	resultBytes, err := os.ReadFile(outPath)
	if err != nil {
		return "", err
	}

	var result struct {
		Choices []struct {
			Message struct {
				Content string `json:"content"`
			} `json:"message"`
		} `json:"choices"`
	}
	if err := json.Unmarshal(resultBytes, &result); err != nil {
		return "", fmt.Errorf("json parse error: %w — body: %s", err, string(resultBytes))
	}
	if len(result.Choices) == 0 {
		return "", fmt.Errorf("пустой ответ")
	}

	return strings.TrimSpace(result.Choices[0].Message.Content), nil
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}
