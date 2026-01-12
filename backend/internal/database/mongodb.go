package database

import (
	"context"
	"time"

	"arck-design/backend/internal/config"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var (
	MongoClient   *mongo.Client
	MongoDB       *mongo.Database
	UsersCollection         *mongo.Collection
	ProjectsCollection      *mongo.Collection
	ImagesCollection        *mongo.Collection
	RefreshTokensCollection *mongo.Collection
	ConversationsCollection *mongo.Collection
	MessagesCollection      *mongo.Collection
	ServicesCollection      *mongo.Collection
	EventsCollection        *mongo.Collection
	PublicProfilesCollection *mongo.Collection
	FavoritesCollection     *mongo.Collection
	UserSettingsCollection  *mongo.Collection
	BillingCollection       *mongo.Collection
	ReviewsCollection       *mongo.Collection
	QuestionsCollection     *mongo.Collection
	BlogPostsCollection     *mongo.Collection
	AnalyticsCollection      *mongo.Collection
	BadgesCollection        *mongo.Collection
	NotificationsCollection *mongo.Collection
	NotificationPrefsCollection *mongo.Collection
	SearchIndexCollection   *mongo.Collection
	ModelFilesCollection    *mongo.Collection
	AdminActionsCollection  *mongo.Collection
	ModerationReportsCollection *mongo.Collection
	PlatformSettingsCollection *mongo.Collection
	FeaturedContentCollection *mongo.Collection
	BoostSubscriptionsCollection *mongo.Collection
)

func ConnectMongoDB() error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	clientOptions := options.Client().ApplyURI(config.AppConfig.MongoDBURI)
	
	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		return err
	}

	// Ping to verify connection
	err = client.Ping(ctx, nil)
	if err != nil {
		return err
	}

	MongoClient = client
	MongoDB = client.Database(config.AppConfig.MongoDBDB)

	// Initialize collections
	UsersCollection = MongoDB.Collection("users")
	ProjectsCollection = MongoDB.Collection("projects")
	ImagesCollection = MongoDB.Collection("images")
	RefreshTokensCollection = MongoDB.Collection("refresh_tokens")
	ConversationsCollection = MongoDB.Collection("conversations")
	MessagesCollection = MongoDB.Collection("messages")
	ServicesCollection = MongoDB.Collection("services")
	EventsCollection = MongoDB.Collection("events")
	PublicProfilesCollection = MongoDB.Collection("public_profiles")
	FavoritesCollection = MongoDB.Collection("favorites")
	UserSettingsCollection = MongoDB.Collection("user_settings")
	BillingCollection = MongoDB.Collection("billing")
	ReviewsCollection = MongoDB.Collection("reviews")
	QuestionsCollection = MongoDB.Collection("questions")
	BlogPostsCollection = MongoDB.Collection("blog_posts")
	AnalyticsCollection = MongoDB.Collection("analytics")
	BadgesCollection = MongoDB.Collection("badges")
	NotificationsCollection = MongoDB.Collection("notifications")
	NotificationPrefsCollection = MongoDB.Collection("notification_preferences")
	SearchIndexCollection = MongoDB.Collection("search_index")
	ModelFilesCollection = MongoDB.Collection("model_files")
	AdminActionsCollection = MongoDB.Collection("admin_actions")
	ModerationReportsCollection = MongoDB.Collection("moderation_reports")
	PlatformSettingsCollection = MongoDB.Collection("platform_settings")
	FeaturedContentCollection = MongoDB.Collection("featured_content")
	BoostSubscriptionsCollection = MongoDB.Collection("boost_subscriptions")

	return nil
}

func DisconnectMongoDB() error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	return MongoClient.Disconnect(ctx)
}

