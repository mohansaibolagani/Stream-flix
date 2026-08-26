package com.example.data.repository

import com.example.data.local.SavedMediaDao
import com.example.data.local.SavedMediaEntity
import com.example.data.model.MediaItem
import com.example.data.model.MediaType
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

class MediaRepository(private val savedMediaDao: SavedMediaDao) {

    val allSaved: Flow<List<SavedMediaEntity>> = savedMediaDao.getAllSaved()
    val myListEntities: Flow<List<SavedMediaEntity>> = savedMediaDao.getMyList()
    val downloadsEntities: Flow<List<SavedMediaEntity>> = savedMediaDao.getDownloads()
    val continueWatchingEntities: Flow<List<SavedMediaEntity>> = savedMediaDao.getContinueWatching()

    suspend fun initDefaultDataIfNeeded() {
        val count = savedMediaDao.getByIdDirect("stranger-things")
        if (count == null) {
            // Seed initial realistic state for the first-launch Netflix experience
            savedMediaDao.insertOrUpdate(
                SavedMediaEntity(
                    id = "stranger-things",
                    isMyList = true,
                    isDownloaded = true,
                    downloadProgress = 1.0f,
                    watchProgress = 0.65f,
                    userLiked = 2,
                    lastWatchedTimestamp = System.currentTimeMillis() - 1000 * 60 * 30,
                    downloadedSizeMb = "2.1 GB"
                )
            )
            savedMediaDao.insertOrUpdate(
                SavedMediaEntity(
                    id = "squid-game",
                    isMyList = true,
                    isDownloaded = false,
                    watchProgress = 0.35f,
                    userLiked = 1,
                    lastWatchedTimestamp = System.currentTimeMillis() - 1000 * 60 * 60 * 4
                )
            )
            savedMediaDao.insertOrUpdate(
                SavedMediaEntity(
                    id = "arcane",
                    isMyList = true,
                    isDownloaded = true,
                    downloadProgress = 1.0f,
                    watchProgress = 0.9f,
                    userLiked = 2,
                    lastWatchedTimestamp = System.currentTimeMillis() - 1000 * 60 * 60 * 24,
                    downloadedSizeMb = "1.8 GB"
                )
            )
            savedMediaDao.insertOrUpdate(
                SavedMediaEntity(
                    id = "cyberpunk-edgerunners",
                    isMyList = false,
                    isDownloaded = true,
                    downloadProgress = 1.0f,
                    watchProgress = 0.15f,
                    lastWatchedTimestamp = System.currentTimeMillis() - 1000 * 60 * 60 * 48,
                    downloadedSizeMb = "950 MB"
                )
            )
            savedMediaDao.insertOrUpdate(
                SavedMediaEntity(
                    id = "wednesday",
                    isMyList = true,
                    isDownloaded = false,
                    watchProgress = 0f,
                    userLiked = 0
                )
            )
        }
    }

    fun getAllMedia(): List<MediaItem> = CatalogData.allMediaItems

    fun getUpcomingMedia(): List<MediaItem> = CatalogData.upcomingItems

    fun getMediaById(id: String): MediaItem? {
        return CatalogData.allMediaItems.find { it.id == id }
            ?: CatalogData.upcomingItems.find { it.id == id }
    }

    fun getSavedState(id: String): Flow<SavedMediaEntity?> = savedMediaDao.getById(id)

    suspend fun toggleMyList(mediaId: String) {
        val existing = savedMediaDao.getByIdDirect(mediaId)
        if (existing != null) {
            savedMediaDao.insertOrUpdate(existing.copy(isMyList = !existing.isMyList))
        } else {
            savedMediaDao.insertOrUpdate(
                SavedMediaEntity(
                    id = mediaId,
                    isMyList = true
                )
            )
        }
    }

    suspend fun setRating(mediaId: String, rating: Int) {
        val existing = savedMediaDao.getByIdDirect(mediaId)
        val currentRating = existing?.userLiked ?: 0
        val newRating = if (currentRating == rating) 0 else rating
        if (existing != null) {
            savedMediaDao.insertOrUpdate(existing.copy(userLiked = newRating))
        } else {
            savedMediaDao.insertOrUpdate(
                SavedMediaEntity(
                    id = mediaId,
                    userLiked = newRating
                )
            )
        }
    }

    suspend fun toggleDownload(mediaId: String) {
        val existing = savedMediaDao.getByIdDirect(mediaId)
        if (existing != null) {
            val newDownloaded = !existing.isDownloaded
            savedMediaDao.insertOrUpdate(
                existing.copy(
                    isDownloaded = newDownloaded,
                    downloadProgress = if (newDownloaded) 1.0f else 0f
                )
            )
        } else {
            savedMediaDao.insertOrUpdate(
                SavedMediaEntity(
                    id = mediaId,
                    isDownloaded = true,
                    downloadProgress = 1.0f
                )
            )
        }
    }

    suspend fun updateWatchProgress(mediaId: String, progress: Float) {
        val existing = savedMediaDao.getByIdDirect(mediaId)
        if (existing != null) {
            savedMediaDao.insertOrUpdate(
                existing.copy(
                    watchProgress = progress,
                    lastWatchedTimestamp = System.currentTimeMillis()
                )
            )
        } else {
            savedMediaDao.insertOrUpdate(
                SavedMediaEntity(
                    id = mediaId,
                    watchProgress = progress,
                    lastWatchedTimestamp = System.currentTimeMillis()
                )
            )
        }
    }

    suspend fun toggleRemindMe(mediaId: String) {
        val existing = savedMediaDao.getByIdDirect(mediaId)
        if (existing != null) {
            savedMediaDao.insertOrUpdate(existing.copy(isReminded = !existing.isReminded))
        } else {
            savedMediaDao.insertOrUpdate(
                SavedMediaEntity(
                    id = mediaId,
                    isReminded = true
                )
            )
        }
    }

    suspend fun removeContinueWatching(mediaId: String) {
        val existing = savedMediaDao.getByIdDirect(mediaId)
        if (existing != null) {
            savedMediaDao.insertOrUpdate(existing.copy(watchProgress = 0f))
        }
    }
}
