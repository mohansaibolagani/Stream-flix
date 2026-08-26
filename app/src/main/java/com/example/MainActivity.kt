package com.example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.BackHandler
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Snackbar
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.data.local.AppDatabase
import com.example.data.repository.MediaRepository
import com.example.ui.components.CategoryPickerDialog
import com.example.ui.components.MediaDetailSheet
import com.example.ui.components.StreamFlixBottomBar
import com.example.ui.components.StreamFlixTopBar
import com.example.ui.components.VideoPlayerView
import com.example.ui.screens.HomeScreen
import com.example.ui.screens.MyNetflixScreen
import com.example.ui.screens.NewAndHotScreen
import com.example.ui.screens.SearchScreen
import com.example.ui.theme.MyApplicationTheme
import com.example.ui.theme.NetflixDarkBackground
import com.example.ui.theme.NetflixRed
import com.example.ui.theme.NetflixSurfaceVariant
import com.example.ui.viewmodel.AppTab
import com.example.ui.viewmodel.HeaderFilter
import com.example.ui.viewmodel.StreamFlixViewModel
import androidx.compose.foundation.border

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MyApplicationTheme {
                val context = LocalContext.current
                val database = remember { AppDatabase.getDatabase(context) }
                val repository = remember { MediaRepository(database.savedMediaDao()) }
                val viewModel: StreamFlixViewModel = viewModel(
                    factory = object : androidx.lifecycle.ViewModelProvider.Factory {
                        @Suppress("UNCHECKED_CAST")
                        override fun <T : androidx.lifecycle.ViewModel> create(modelClass: Class<T>): T {
                            return StreamFlixViewModel(repository) as T
                        }
                    }
                )

                StreamFlixApp(viewModel = viewModel)
            }
        }
    }
}

@Composable
fun StreamFlixApp(viewModel: StreamFlixViewModel) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    val savedEntities by viewModel.allSavedEntities.collectAsStateWithLifecycle()
    val myList by viewModel.myList.collectAsStateWithLifecycle()
    val downloads by viewModel.downloadsList.collectAsStateWithLifecycle()
    val continueWatching by viewModel.continueWatchingList.collectAsStateWithLifecycle()

    // Handle Android system back gesture cleanly
    BackHandler(enabled = uiState.activePlayingMedia != null || uiState.selectedMedia != null || uiState.isCategoryPickerOpen || uiState.activeTab != AppTab.HOME) {
        when {
            uiState.activePlayingMedia != null -> viewModel.closePlayer()
            uiState.selectedMedia != null -> viewModel.closeMediaDetail()
            uiState.isCategoryPickerOpen -> viewModel.toggleCategoryPicker(false)
            uiState.activeTab != AppTab.HOME -> viewModel.selectTab(AppTab.HOME)
        }
    }

    Scaffold(
        bottomBar = {
            if (uiState.activePlayingMedia == null) {
                StreamFlixBottomBar(
                    activeTab = uiState.activeTab,
                    activeProfile = uiState.activeProfile,
                    onTabSelected = { viewModel.selectTab(it) }
                )
            }
        },
        containerColor = NetflixDarkBackground,
        modifier = Modifier.fillMaxSize()
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(bottom = innerPadding.calculateBottomPadding())
        ) {
            // Main Screen Container based on active tab
            when (uiState.activeTab) {
                AppTab.HOME -> {
                    HomeScreen(
                        headerFilter = uiState.headerFilter,
                        selectedCategoryGenre = uiState.selectedCategoryGenre,
                        activeProfile = uiState.activeProfile,
                        savedEntities = savedEntities,
                        continueWatchingList = continueWatching,
                        onPlayMedia = { viewModel.playMedia(it) },
                        onOpenMediaDetail = { viewModel.openMediaDetail(it) },
                        onToggleMyList = { viewModel.toggleMyList(it) },
                        onRemoveContinueWatching = { viewModel.removeContinueWatching(it) }
                    )

                    // Sticky Translucent Netflix Top Bar over Home
                    StreamFlixTopBar(
                        currentFilter = uiState.headerFilter,
                        selectedCategoryGenre = uiState.selectedCategoryGenre,
                        activeProfile = uiState.activeProfile,
                        profiles = uiState.profiles,
                        isProfileMenuOpen = uiState.isProfileMenuOpen,
                        onFilterSelected = { viewModel.setHeaderFilter(it) },
                        onOpenCategoryPicker = { viewModel.toggleCategoryPicker(true) },
                        onClearCategory = { viewModel.selectCategoryGenre(null) },
                        onToggleProfileMenu = { viewModel.toggleProfileMenu(it) },
                        onProfileSelected = { viewModel.selectProfile(it) },
                        onSearchClick = { viewModel.selectTab(AppTab.SEARCH) },
                        onCastClick = { viewModel.showToast("Ready to cast to Living Room TV") }
                    )
                }

                AppTab.SEARCH -> {
                    SearchScreen(
                        searchQuery = uiState.searchQuery,
                        selectedGenre = uiState.selectedSearchGenre,
                        onSearchQueryChange = { viewModel.updateSearchQuery(it) },
                        onSelectGenre = { viewModel.selectSearchGenre(it) },
                        onOpenMediaDetail = { viewModel.openMediaDetail(it) },
                        onPlayMedia = { viewModel.playMedia(it) }
                    )
                }

                AppTab.NEW_AND_HOT -> {
                    NewAndHotScreen(
                        savedEntities = savedEntities,
                        onOpenMediaDetail = { viewModel.openMediaDetail(it) },
                        onPlayMedia = { viewModel.playMedia(it) },
                        onToggleRemindMe = { viewModel.toggleRemindMe(it) }
                    )
                }

                AppTab.MY_NETFLIX -> {
                    MyNetflixScreen(
                        activeProfile = uiState.activeProfile,
                        profiles = uiState.profiles,
                        myList = myList,
                        downloads = downloads,
                        continueWatchingList = continueWatching,
                        onSelectProfile = { viewModel.selectProfile(it) },
                        onOpenMediaDetail = { viewModel.openMediaDetail(it) },
                        onPlayMedia = { viewModel.playMedia(it) },
                        onToggleDownload = { viewModel.toggleDownload(it) },
                        onRemoveContinueWatching = { viewModel.removeContinueWatching(it) },
                        onOpenSettings = { viewModel.showToast("Settings updated") }
                    )
                }
            }

            // Categories Picker Overlay Modal
            if (uiState.isCategoryPickerOpen) {
                CategoryPickerDialog(
                    selectedCategory = uiState.selectedCategoryGenre,
                    onSelectCategory = { genre ->
                        viewModel.selectCategoryGenre(genre)
                        viewModel.setHeaderFilter(if (genre != null) HeaderFilter.CATEGORIES else HeaderFilter.ALL)
                    },
                    onDismiss = { viewModel.toggleCategoryPicker(false) }
                )
            }

            // Media Detail Bottom Sheet
            uiState.selectedMedia?.let { selected ->
                val saved = savedEntities.find { it.id == selected.id }
                MediaDetailSheet(
                    media = selected,
                    savedState = saved,
                    onDismiss = { viewModel.closeMediaDetail() },
                    onPlay = {
                        viewModel.closeMediaDetail()
                        viewModel.playMedia(selected)
                    },
                    onToggleMyList = { viewModel.toggleMyList(selected.id) },
                    onRate = { rating -> viewModel.rateMedia(selected.id, rating) },
                    onToggleDownload = { viewModel.toggleDownload(selected.id) },
                    onSelectRecommended = { viewModel.openMediaDetail(it) }
                )
            }

            // Interactive Full-Screen Video Player View
            uiState.activePlayingMedia?.let { playingMedia ->
                VideoPlayerView(
                    media = playingMedia,
                    playbackState = uiState.playbackState,
                    onClosePlayer = { viewModel.closePlayer() },
                    onTogglePlayPause = { viewModel.togglePlayPause() },
                    onSeekRelative = { viewModel.seekRelative(it) },
                    onSeekToFraction = { viewModel.seekToFraction(it) },
                    onSetSpeed = { viewModel.setPlaybackSpeed(it) },
                    onSetAudioAndSubtitle = { audio, sub -> viewModel.setAudioAndSubtitle(audio, sub) }
                )
            }

            // Netflix Floating Toast Banner
            AnimatedVisibility(
                visible = uiState.toastMessage != null,
                enter = fadeIn() + slideInVertically(initialOffsetY = { -it }),
                exit = fadeOut() + slideOutVertically(targetOffsetY = { -it }),
                modifier = Modifier
                    .align(Alignment.TopCenter)
                    .padding(top = 54.dp, start = 20.dp, end = 20.dp)
            ) {
                uiState.toastMessage?.let { msg ->
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(24.dp))
                            .background(NetflixSurfaceVariant.copy(alpha = 0.95f))
                            .border(1.dp, Color.White.copy(alpha = 0.15f), RoundedCornerShape(24.dp))
                            .padding(horizontal = 20.dp, vertical = 10.dp)
                    ) {
                        Text(
                            text = msg,
                            color = Color.White,
                            fontSize = 13.sp,
                            fontWeight = FontWeight.SemiBold
                        )
                    }
                }
            }
        }
    }
}

