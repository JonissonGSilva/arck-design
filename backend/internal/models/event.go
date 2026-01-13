package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type EventType string

const (
	EventTypeReuniao      EventType = "reuniao"
	EventTypeVisita       EventType = "visita"
	EventTypeApresentacao EventType = "apresentacao"
	EventTypeConsultoria  EventType = "consultoria"
	EventTypeOutro        EventType = "outro"
)

type EventStatus string

const (
	EventStatusConfirmado EventStatus = "confirmado"
	EventStatusPendente   EventStatus = "pendente"
	EventStatusConcluido  EventStatus = "concluido"
	EventStatusCancelado  EventStatus = "cancelado"
)

type EventLocation string

const (
	EventLocationEscritorio EventLocation = "Escritório"
	EventLocationCliente     EventLocation = "Cliente"
	EventLocationObra        EventLocation = "Obra"
	EventLocationPrefeitura  EventLocation = "Prefeitura"
	EventLocationOutro       EventLocation = "Outro"
)

type EventReminder struct {
	Enabled       bool `bson:"enabled" json:"enabled"`
	MinutesBefore int  `bson:"minutesBefore" json:"minutesBefore"`
}

type Event struct {
	ID             primitive.ObjectID  `bson:"_id,omitempty" json:"id"`
	UserID         primitive.ObjectID  `bson:"userId" json:"userId"`
	ClientID       *primitive.ObjectID `bson:"clientId,omitempty" json:"clientId,omitempty"`
	ProjectID      *primitive.ObjectID `bson:"projectId,omitempty" json:"projectId,omitempty"`
	Title          string              `bson:"title" json:"title"`
	Description    string              `bson:"description,omitempty" json:"description,omitempty"`
	Date           time.Time           `bson:"date" json:"date"`
	Time           string              `bson:"time" json:"time"` // HH:MM
	Duration       int                 `bson:"duration" json:"duration"` // minutos
	Location       EventLocation       `bson:"location" json:"location"`
	LocationAddress string             `bson:"locationAddress,omitempty" json:"locationAddress,omitempty"`
	Type           EventType            `bson:"type" json:"type"`
	Status         EventStatus         `bson:"status" json:"status"`
	Reminder       *EventReminder      `bson:"reminder,omitempty" json:"reminder,omitempty"`
	RequestedBy    string              `bson:"requestedBy,omitempty" json:"requestedBy,omitempty"` // cliente ou arquiteto
	CreatedAt      time.Time           `bson:"createdAt" json:"createdAt"`
	UpdatedAt      time.Time           `bson:"updatedAt" json:"updatedAt"`
}


