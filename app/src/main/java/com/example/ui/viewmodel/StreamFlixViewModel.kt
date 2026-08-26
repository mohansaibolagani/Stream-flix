package com.example.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.data.local.SavedMediaEntity
import com.example.data.model.MediaItem
import com.example.data.model.MediaType
import com.example.data.model.Profile
import com.example.data.repository.CatalogData
import com.example.data.repository.MediaRepository
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

enum class AppTab {
    HOME,
    SEARCH,
    NEW_AND_HOT,
    MY_NETFLIX
}

enum class HeaderFilter {
    ALL,
    TV_SHOWS,
    MOVIES,
    CATEGORIES
}

data class VideoPlaybackState(
    val isPlaying: Boolean = true,
    val currentPositionSeconds: Int = 120,
    val totalDurationSeconds: Int = 3600,
    val playbackSpeed: Float = 1.0f,
    val audioTrack: String = "English [Original]",
    val subtitleTrack: String = "English",
    val isMuted: Boolean = false,
    val isFullScreen: Boolean = false,
    val selectedSeason: Int = 1
)

data class UiState(
    val activeTab: AppTab = AppTab.HOME,
    val headerFilter: HeaderFilter = HeaderFilter.ALL,
    val selectedCategoryGenre: String? = null,
    val activeProfile: Profile = CatalogData.profiles.first(),
    val profiles: List<Profile> = CatalogData.profiles,
    val isProfileMenuOpen: Boolean = false,
    val isCategoryPickerOpen: Boolean = false,
    val searchQuery: String = "",
    val selectedSearchGenre: String? = null,
    val selectedMedia: MediaItem? = null,
    val activePlayingMedia: MediaItem? = null,
    val playbackState: VideoPlaybackState = VideoPlaybackState(),
    val isAudioSubtitleDialogOpen: Boolean = false,
    val toastMessage: String? = null
)

class StreamFlixViewModel(private val repository: MediaRepository) : ViewModel() {

    private val _uiState = MutableStateFlow(UiState())
    val uiState: StateFlow<UiState> = _uiState.asStateFlow()

    val allSavedEntities: StateFlow<List<SavedMediaEntity>> = repository.allSaved
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = emptyList()
        )

    val myList: StateFlow<List<MediaItem>> = repository.myListEntities
        .combine(_uiState) { entities, _ ->
            val ids = entities.map { it.id }.toSet()
            CatalogData.allMediaItems.filter { it.id in ids }
        }
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = emptyList()
        )

    val downloadsList: StateFlow<List<Pair<MediaItem, SavedMediaEntity>>> = repository.downloadsEntities
        .combine(_uiState) { entities, _ ->
            entities.mapNotNull { entity ->
                val media = CatalogData.allMediaItems.find { it.id == entity.id }
                    ?: CatalogData.upcomingItems.find { it.id == entity.id }
                if (media != null) Pair(media, entity) else null
            }
        }
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = emptyList()
        )

    val continueWatchingList: StateFlow<List<Pair<MediaItem, Float>>> = repository.continueWatchingEntities
        .combine(_uiState) { entities, _ ->
            entities.mapNotNull { entity ->
                val media = CatalogData.allMediaItems.find { it.id == entity.id }
                if (media != null && entity.watchProgress > 0f) {
                    Pair(media, entity.watchProgress)
                } else null
            }
        }
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = emptyList()
        )

    init {
        viewModelScope.launch {
            repository.initDefaultDataIfNeeded()
        }
    }

    fun selectTab(tab: AppTab) {
        _uiState.value = _uiState.value.copy(activeTab = tab)
    }

    fun setHeaderFilter(filter: HeaderFilter) {
        _uiState.value = _uiState.value.copy(
            headerFilter = filter,
            selectedCategoryGenre = if (filter == HeaderFilter.CATEGORIES) _uiState.value.selectedCategoryGenre else null
        )
    }

    fun selectCategoryGenre(genre: String?) {
        _uiState.value = _uiState.value.copy(
            selectedCategoryGenre = genre,
            isCategoryPickerOpen = false
        )
    }

    fun toggleCategoryPicker(open: Boolean) {
        _uiState.value = _uiState.value.copy(isCategoryPickerOpen = open)
    }

    fun selectProfile(profile: Profile) {
        _uiState.value = _uiState.value.copy(
            activeProfile = profile,
            isProfileMenuOpen = false
        )
        showToast("Switched to ${profile.name}'s profile")
    }

    fun toggleProfileMenu(open: Boolean) {
        _uiState.value = _uiState.value.copy(isProfileMenuOpen = open)
    }

    fun updateSearchQuery(query: String) {
        _uiState.value = _uiState.value.copy(searchQuery = query)
    }

    fun selectSearchGenre(genre: String?) {
        _uiState.value = _uiState.value.copy(
            selectedSearchGenre = if (_uiState.value.selectedSearchGenre == genre) null else genre
        )
    }

    fun openMediaDetail(media: MediaItem) {
        _uiState.value = _uiState.value.copy(selectedMedia = media)
    }

    fun closeMediaDetail() {
        _uiState.value = _uiState.value.copy(selectedMedia = null)
    }

    fun playMedia(media: MediaItem) {
        _uiState.value = _uiState.value.copy(
            activePlayingMedia = media,
            playbackState = VideoPlaybackState(
                isPlaying = true,
                currentPositionSeconds = 45,
                totalDurationSeconds = if (media.type == MediaType.MOVIE) 7200 else 3200
            )
        )
        // Record watch progress
        viewModelScope.launch {
            repository.updateWatchProgress(media.id, 0.25f)
        }
    }

    fun closePlayer() {
        _uiState.value = _uiState.value.copy(activePlayingMedia = null)
    }

    fun togglePlayPause() {
        val current = _uiState.value.playbackState
        _uiState.value = _uiState.value.copy(
            playbackState = current.copy(isPlaying = !current.isPlaying)
        )
    }

    fun seekRelative(seconds: Int) {
        val current = _uiState.value.playbackState
        val newPos = (current.currentPositionSeconds + seconds).coerceIn(0, current.totalDurationSeconds)
        _uiState.value = _uiState.value.copy(
            playbackState = current.copy(currentPositionSeconds = newPos)
        )
    }

    fun seekToFraction(fraction: Float) {
        val current = _uiState.value.playbackState
        val newPos = (fraction * current.totalDurationSeconds).toInt().coerceIn(0, current.totalDurationSeconds)
        _uiState.value = _uiState.value.copy(
            playbackState = current.copy(currentPositionSeconds = newPos)
        )
    }

    fun setPlaybackSpeed(speed: Float) {
        val current = _uiState.value.playbackState
        _uiState.value = _uiState.value.copy(
            playbackState = current.copy(playbackSpeed = speed)
        )
        showToast("Speed set to ${speed}x")
    }

    fun setAudioAndSubtitle(audio: String, subtitle: String) {
        val current = _uiState.value.playbackState
        _uiState.value = _uiState.value.copy(
            playbackState = current.copy(audioTrack = audio, subtitleTrack = subtitle),
            isAudioSubtitleDialogOpen = false
        )
        showToast("Audio: $audio | Subtitles: $subtitle")
    }

    fun toggleAudioSubtitleDialog(open: Boolean) {
        _uiState.value = _uiState.value.copy(isAudioSubtitleDialogOpen = open)
    }

    fun toggleMyList(mediaId: String) {
        viewModelScope.launch {
            repository.toggleMyList(mediaId)
            val isNowSaved = repository.getMediaById(mediaId)?.let {
                allSavedEntities.value.find { e -> e.id == mediaId }?.isMyList != true
            } ?: false
            showToast(if (isNowSaved) "Added to My List" else "Removed from My List")
        }
    }

    fun rateMedia(mediaId: String, rating: Int) {
        viewModelScope.launch {
            repository.setRating(mediaId, rating)
            val msg = when (rating) {
                1 -> "Liked 👍"
                2 -> "Loved it! ❤️"
                -1 -> "Not for me 👎"
                else -> "Rating removed"
            }
            showToast(msg)
        }
    }

    fun toggleDownload(mediaId: String) {
        viewModelScope.launch {
            repository.toggleDownload(mediaId)
            val isNowDownloaded = allSavedEntities.value.find { it.id == mediaId }?.isDownloaded != true
            showToast(if (isNowDownloaded) "Downloading to device..." else "Removed from Downloads")
        }
    }

    fun toggleRemindMe(mediaId: String) {
        viewModelScope.launch {
            repository.toggleRemindMe(mediaId)
            showToast("Reminder set! We'll notify you on release.")
        }
    }

    fun removeContinueWatching(mediaId: String) {
        viewModelScope.launch {
            repository.removeContinueWatching(mediaId)
            showToast("Removed from Continue Watching")
        }
    }

    fun showToast(message: String) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(toastMessage = message)
            delay(2200)
            if (_uiState.value.toastMessage == message) {
                _uiState.value = _uiState.value.copy(toastMessage = null)
            }
        }
    }
}
