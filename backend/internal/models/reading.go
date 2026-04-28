package models

import "time"

type Reading struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	UserID    uint      `gorm:"not null" json:"user_id"`
	Spread    string    `gorm:"not null" json:"spread"`
	Question  string    `gorm:"not null" json:"question"`
	Cards     string    `gorm:"not null" json:"cards"`
	Answer    string    `gorm:"not null;default:''" json:"answer"`
	CreatedAt time.Time `json:"created_at"`
}
