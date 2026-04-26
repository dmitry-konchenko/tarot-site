package handlers

import (
	"net/http"
	"os"
	"time"

	"tarot-backend/internal/db"
	"tarot-backend/internal/models"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type registerRequest struct {
	Name     string `json:"name" binding:"required"`
	Login    string `json:"login" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type loginRequest struct {
	Login    string `json:"login" binding:"required"`
	Password string `json:"password" binding:"required"`
}

func Register(c *gin.Context) {
	var req registerRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Заполните все поля"})
		return
	}

	hashed, err := bcrypt.GenerateFromPassword([]byte(req.Password), 12)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка сервера"})
		return
	}

	user := models.User{
		Name:     req.Name,
		Login:    req.Login,
		Password: string(hashed),
	}

	if result := db.DB.Create(&user); result.Error != nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Логин уже занят"})
		return
	}

	token, err := generateToken(user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка сервера"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"token": token,
		"user":  gin.H{"id": user.ID, "name": user.Name, "login": user.Login},
	})
}

func Login(c *gin.Context) {
	var req loginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Заполните все поля"})
		return
	}

	var user models.User
	if result := db.DB.Where("login = ?", req.Login).First(&user); result.Error != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Неверный логин или пароль"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Неверный логин или пароль"})
		return
	}

	token, err := generateToken(user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка сервера"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token": token,
		"user":  gin.H{"id": user.ID, "name": user.Name, "login": user.Login},
	})
}

func generateToken(userID uint) (string, error) {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		secret = "dev-secret-change-in-prod"
	}

	claims := jwt.MapClaims{
		"user_id": userID,
		"exp":     time.Now().Add(7 * 24 * time.Hour).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(secret))
}
