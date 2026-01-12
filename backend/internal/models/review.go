package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Review struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	ArchitectID primitive.ObjectID `bson:"architectId" json:"architectId"`
	ClientID    primitive.ObjectID `bson:"clientId" json:"clientId"`
	ProjectID  *primitive.ObjectID `bson:"projectId,omitempty" json:"projectId,omitempty"`
	Rating      int                `bson:"rating" json:"rating"` // 1-5
	Comment     string             `bson:"comment,omitempty" json:"comment,omitempty"`
	Verified    bool               `bson:"verified" json:"verified"`
	Helpful     int                `bson:"helpful" json:"helpful"`
	CreatedAt   time.Time          `bson:"createdAt" json:"createdAt"`
	UpdatedAt   time.Time          `bson:"updatedAt" json:"updatedAt"`
}

