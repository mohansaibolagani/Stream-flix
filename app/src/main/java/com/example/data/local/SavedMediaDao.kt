package com.example.data.local

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import kotlinx.coroutines.flow.Flow

@Dao
interface SavedMediaDao {
    @Query("SELECT * FROM saved_media")
    fun getAllSaved(): Flow<List<SavedMediaEntity>>

    @Query("SELECT * FROM saved_media WHERE isMyList = 1")
    fun getMyList(): Flow<List<SavedMediaEntity>>

    @Query("SELECT * FROM saved_media WHERE isDownloaded = 1")
    fun getDownloads(): Flow<List<SavedMediaEntity>>

    @Query("SELECT * FROM saved_media WHERE watchProgress > 0 ORDER BY lastWatchedTimestamp DESC")
    fun getContinueWatching(): Flow<List<SavedMediaEntity>>

    @Query("SELECT * FROM saved_media WHERE id = :id LIMIT 1")
    fun getById(id: String): Flow<SavedMediaEntity?>

    @Query("SELECT * FROM saved_media WHERE id = :id LIMIT 1")
    suspend fun getByIdDirect(id: String): SavedMediaEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertOrUpdate(entity: SavedMediaEntity)

    @Query("DELETE FROM saved_media WHERE id = :id")
    suspend fun delete(id: String)
}
