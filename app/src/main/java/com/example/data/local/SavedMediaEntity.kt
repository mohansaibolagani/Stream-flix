package com.example.data.local

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "saved_media")
data class SavedMediaEntity(
    @PrimaryKey val id: String,
    val isMyList: Boolean = false,
    val isDownloaded: Boolean = false,
    val downloadProgress: Float = 0f,
    val watchProgress: Float = 0f,
    val userLiked: Int = 0, // 0 = none, 1 = thumbs up, 2 = double thumbs up, -1 = thumbs down
    val isReminded: Boolean = false,
    val lastWatchedTimestamp: Long = 0L,
    val downloadedSizeMb: String = "1.4 GB"
)
