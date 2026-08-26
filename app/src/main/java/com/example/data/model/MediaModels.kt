package com.example.data.model

enum class MediaType {
    MOVIE,
    TV_SHOW
}

data class Episode(
    val id: String,
    val episodeNumber: Int,
    val seasonNumber: Int,
    val title: String,
    val duration: String,
    val description: String,
    val thumbnailUrl: String,
    val watchProgress: Float = 0f
)

data class MediaItem(
    val id: String,
    val title: String,
    val type: MediaType,
    val posterUrl: String,
    val backdropUrl: String,
    val description: String,
    val matchScore: Int,
    val rating: String, // e.g. "TV-MA", "PG-13", "TV-14"
    val year: Int,
    val durationOrSeasons: String, // "4 Seasons" or "2h 15m"
    val genres: List<String>,
    val cast: List<String>,
    val director: String,
    val badge: String? = null, // "TOP 10", "NEW SEASON", "NETFLIX ORIGINAL"
    val isOriginal: Boolean = true,
    val videoSnippetTitle: String = "Official Trailer",
    val episodes: List<Episode> = emptyList(),
    val releaseDateFormatted: String? = null,
    val audioDescription: String = "English [Original], Spanish, French, Japanese",
    val subtitles: String = "English, Spanish, French, German, Japanese"
)

data class Profile(
    val id: String,
    val name: String,
    val avatarColor: Long,
    val isKids: Boolean = false,
    val iconEmoji: String = "🎬"
)
