package models

import "time"

type User struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Name      string    `gorm:"not null" json:"name"`
	Login     string    `gorm:"unique;not null" json:"login"`
	Password  string    `gorm:"not null" json:"-"`
	CreatedAt time.Time `json:"created_at"`
}
