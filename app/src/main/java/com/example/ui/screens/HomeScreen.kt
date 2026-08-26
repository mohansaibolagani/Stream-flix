package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.example.data.local.SavedMediaEntity
import com.example.data.model.MediaItem
import com.example.data.model.MediaType
import com.example.data.model.Profile
import com.example.data.repository.CatalogData
import com.example.ui.components.ContinueWatchingRow
import com.example.ui.components.HeroBillboard
import com.example.ui.components.MediaRow
import com.example.ui.components.TopRankedRow
import com.example.ui.theme.NetflixDarkBackground
import com.example.ui.viewmodel.HeaderFilter

@Composable
fun HomeScreen(
    headerFilter: HeaderFilter,
    selectedCategoryGenre: String?,
    activeProfile: Profile,
    savedEntities: List<SavedMediaEntity>,
    continueWatchingList: List<Pair<MediaItem, Float>>,
    onPlayMedia: (MediaItem) -> Unit,
    onOpenMediaDetail: (MediaItem) -> Unit,
    onToggleMyList: (String) -> Unit,
    onRemoveContinueWatching: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    val scrollState = rememberScrollState()

    val allMedia = CatalogData.allMediaItems

    // Filter media based on top bar selection
    val filteredMedia = when (headerFilter) {
        HeaderFilter.TV_SHOWS -> allMedia.filter { it.type == MediaType.TV_SHOW }
        HeaderFilter.MOVIES -> allMedia.filter { it.type == MediaType.MOVIE }
        HeaderFilter.CATEGORIES -> {
            if (selectedCategoryGenre != null) {
                allMedia.filter { media ->
                    media.genres.any { g -> selectedCategoryGenre.contains(g, ignoreCase = true) }
                }
            } else allMedia
        }
        HeaderFilter.ALL -> allMedia
    }

    val billboardItem = filteredMedia.firstOrNull() ?: CatalogData.billboardItem
    val isBillboardSaved = savedEntities.find { it.id == billboardItem.id }?.isMyList == true

    val trendingNow = filteredMedia.sortedByDescending { it.matchScore }
    val originals = filteredMedia.filter { it.isOriginal }
    val sciFiAndFantasy = filteredMedia.filter { it.genres.any { g -> g in listOf("Sci-Fi", "Fantasy", "Anime") } }
    val actionAndThrillers = filteredMedia.filter { it.genres.any { g -> g in listOf("Action", "Thriller", "Crime", "Suspenseful") } }
    val dramasAndMystery = filteredMedia.filter { it.genres.any { g -> g in listOf("Drama", "Mystery", "Psychological", "Dark") } }

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(NetflixDarkBackground)
    ) {

        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(scrollState)
        ) {
            // Hero Billboard
            HeroBillboard(
                media = billboardItem,
                isSavedInMyList = isBillboardSaved,
                onPlayClick = { onPlayMedia(billboardItem) },
                onMyListToggle = { onToggleMyList(billboardItem.id) },
                onInfoClick = { onOpenMediaDetail(billboardItem) }
            )

            // Continue Watching for Profile
            if (continueWatchingList.isNotEmpty()) {
                ContinueWatchingRow(
                    profileName = activeProfile.name,
                    items = continueWatchingList,
                    onPlayItem = onPlayMedia,
                    onInfoClick = onOpenMediaDetail,
                    onRemoveItem = { onRemoveContinueWatching(it.id) }
                )
            }

            // Top 10 Ranked Row
            TopRankedRow(
                title = if (headerFilter == HeaderFilter.MOVIES) "Top 10 Movies Today" else "Top 10 TV Shows Today",
                items = trendingNow,
                onItemClick = onOpenMediaDetail
            )

            // StreamFlix Originals Row
            if (originals.isNotEmpty()) {
                MediaRow(
                    title = "Only on StreamFlix",
                    items = originals,
                    onItemClick = onOpenMediaDetail
                )
            }

            // Action & Thrillers Row
            if (actionAndThrillers.isNotEmpty()) {
                MediaRow(
                    title = "Action & Adrenaline Thrillers",
                    items = actionAndThrillers,
                    onItemClick = onOpenMediaDetail
                )
            }

            // Sci-Fi & Fantasy Masterpieces Row
            if (sciFiAndFantasy.isNotEmpty()) {
                MediaRow(
                    title = "Sci-Fi & Mind-Bending Worlds",
                    items = sciFiAndFantasy,
                    onItemClick = onOpenMediaDetail
                )
            }

            // Binge-Worthy Dramas & Mystery Row
            if (dramasAndMystery.isNotEmpty()) {
                MediaRow(
                    title = "Critically Acclaimed & Binge-Worthy",
                    items = dramasAndMystery,
                    onItemClick = onOpenMediaDetail
                )
            }

            // Popular on StreamFlix
            MediaRow(
                title = "Popular on StreamFlix",
                items = filteredMedia.shuffled(),
                onItemClick = onOpenMediaDetail
            )

            Spacer(modifier = Modifier.height(80.dp))
        }
    }
}
