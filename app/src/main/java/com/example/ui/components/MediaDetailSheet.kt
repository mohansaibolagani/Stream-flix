package com.example.ui.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.ArrowDropDown
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Download
import androidx.compose.material.icons.filled.DownloadDone
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Share
import androidx.compose.material.icons.filled.ThumbDown
import androidx.compose.material.icons.filled.ThumbUp
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.Tab
import androidx.compose.material3.TabRow
import androidx.compose.material3.TabRowDefaults
import androidx.compose.material3.TabRowDefaults.tabIndicatorOffset
import androidx.compose.material3.Text
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.example.data.local.SavedMediaEntity
import com.example.data.model.Episode
import com.example.data.model.MediaItem
import com.example.data.model.MediaType
import com.example.data.repository.CatalogData
import com.example.ui.theme.NetflixBlack
import com.example.ui.theme.NetflixBorder
import com.example.ui.theme.NetflixCardSurface
import com.example.ui.theme.NetflixDarkBackground
import com.example.ui.theme.NetflixMatchGreen
import com.example.ui.theme.NetflixRed
import com.example.ui.theme.NetflixSurface
import com.example.ui.theme.NetflixSurfaceVariant
import com.example.ui.theme.NetflixTextPrimary
import com.example.ui.theme.NetflixTextSecondary

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MediaDetailSheet(
    media: MediaItem,
    savedState: SavedMediaEntity?,
    onDismiss: () -> Unit,
    onPlay: () -> Unit,
    onToggleMyList: () -> Unit,
    onRate: (Int) -> Unit,
    onToggleDownload: () -> Unit,
    onSelectRecommended: (MediaItem) -> Unit,
    modifier: Modifier = Modifier
) {
    val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)
    var selectedTabIndex by remember { mutableIntStateOf(0) }
    var selectedSeason by remember { mutableIntStateOf(1) }
    var isSeasonDropdownOpen by remember { mutableStateOf(false) }
    var isRatingDropdownOpen by remember { mutableStateOf(false) }

    val isSaved = savedState?.isMyList == true
    val isDownloaded = savedState?.isDownloaded == true
    val currentRating = savedState?.userLiked ?: 0

    ModalBottomSheet(
        onDismissRequest = onDismiss,
        sheetState = sheetState,
        containerColor = NetflixDarkBackground,
        dragHandle = null,
        modifier = modifier
            .fillMaxHeight(0.92f)
            .border(1.dp, Color.White.copy(alpha = 0.1f), RoundedCornerShape(topStart = 20.dp, topEnd = 20.dp))
    ) {
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .navigationBarsPadding()
        ) {
            // Backdrop Header
            item {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(235.dp)
                ) {
                    AsyncImage(
                        model = media.backdropUrl,
                        contentDescription = media.title,
                        contentScale = ContentScale.Crop,
                        modifier = Modifier.fillMaxSize()
                    )

                    // Top Dismiss X Button
                    Box(
                        modifier = Modifier
                            .align(Alignment.TopEnd)
                            .padding(14.dp)
                            .size(34.dp)
                            .clip(CircleShape)
                            .background(Color.Black.copy(alpha = 0.7f))
                            .border(1.dp, Color.White.copy(alpha = 0.15f), CircleShape)
                            .clickable { onDismiss() },
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.Close,
                            contentDescription = "Close",
                            tint = Color.White,
                            modifier = Modifier.size(18.dp)
                        )
                    }

                    // Bottom gradient blend
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .background(
                                Brush.verticalGradient(
                                    colors = listOf(
                                        Color.Transparent,
                                        Color.Transparent,
                                        NetflixDarkBackground.copy(alpha = 0.8f),
                                        NetflixDarkBackground
                                    )
                                )
                            )
                    )
                }
            }

            // Info Section
            item {
                Column(modifier = Modifier.padding(horizontal = 16.dp)) {
                    // Original Series/Film badge
                    if (media.isOriginal) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            Text(
                                text = "N",
                                color = NetflixRed,
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Black
                            )
                            Text(
                                text = if (media.type == MediaType.TV_SHOW) "S E R I E S" else "F I L M",
                                color = NetflixTextSecondary,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                letterSpacing = 2.5.sp
                            )
                        }
                        Spacer(modifier = Modifier.height(4.dp))
                    }

                    // Title
                    Text(
                        text = media.title,
                        color = Color.White,
                        fontSize = 24.sp,
                        fontWeight = FontWeight.Black,
                        letterSpacing = (-0.3).sp
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    // Metadata row (Match %, Year, Rating badge, Duration/Seasons, 4K HDR)
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Text(
                            text = "${media.matchScore}% Match",
                            color = NetflixMatchGreen,
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Bold
                        )

                        Text(
                            text = "${media.year}",
                            color = NetflixTextSecondary,
                            fontSize = 13.sp
                        )

                        // Rating badge (TV-MA, PG-13)
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(4.dp))
                                .background(NetflixSurfaceVariant)
                                .border(0.5.dp, Color.White.copy(alpha = 0.1f), RoundedCornerShape(4.dp))
                                .padding(horizontal = 6.dp, vertical = 2.dp)
                        ) {
                            Text(
                                text = media.rating,
                                color = NetflixTextPrimary,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }

                        Text(
                            text = media.durationOrSeasons,
                            color = NetflixTextSecondary,
                            fontSize = 13.sp
                        )

                        // 4K Ultra HD badge
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(4.dp))
                                .border(1.dp, NetflixBorder, RoundedCornerShape(4.dp))
                                .padding(horizontal = 5.dp, vertical = 2.dp)
                        ) {
                            Text(
                                text = "4K ULTRA HD",
                                color = NetflixTextSecondary,
                                fontSize = 9.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    // Big White Play Button
                    Button(
                        onClick = onPlay,
                        colors = ButtonDefaults.buttonColors(
                            containerColor = Color.White,
                            contentColor = Color.Black
                        ),
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(46.dp)
                            .testTag("detail_play_button")
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.PlayArrow,
                                contentDescription = "Play",
                                tint = Color.Black,
                                modifier = Modifier.size(24.dp)
                            )
                            Text(
                                text = if ((savedState?.watchProgress ?: 0f) > 0f) "Resume" else "Play",
                                color = Color.Black,
                                fontSize = 15.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    // Dark Download Button
                    Button(
                        onClick = onToggleDownload,
                        colors = ButtonDefaults.buttonColors(
                            containerColor = NetflixSurfaceVariant,
                            contentColor = Color.White
                        ),
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(46.dp)
                            .border(1.dp, Color.White.copy(alpha = 0.08f), RoundedCornerShape(8.dp))
                            .testTag("detail_download_button")
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            Icon(
                                imageVector = if (isDownloaded) Icons.Default.DownloadDone else Icons.Default.Download,
                                contentDescription = "Download",
                                tint = if (isDownloaded) NetflixRed else Color.White,
                                modifier = Modifier.size(20.dp)
                            )
                            Text(
                                text = if (isDownloaded) "Downloaded" else "Download",
                                color = if (isDownloaded) NetflixRed else Color.White,
                                fontSize = 14.sp,
                                fontWeight = FontWeight.SemiBold
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    // Description / Synopsis
                    Text(
                        text = media.description,
                        color = NetflixTextPrimary,
                        fontSize = 13.5.sp,
                        lineHeight = 20.sp
                    )

                    Spacer(modifier = Modifier.height(10.dp))

                    // Cast & Creators
                    Text(
                        text = "Starring: " + media.cast.joinToString(", "),
                        color = NetflixTextSecondary,
                        fontSize = 11.5.sp,
                        maxLines = 2,
                        overflow = TextOverflow.Ellipsis
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Creator / Director: ${media.director}",
                        color = NetflixTextSecondary,
                        fontSize = 11.5.sp
                    )

                    Spacer(modifier = Modifier.height(16.dp))

                    // Actions Bar: My List, Rate, Share
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 8.dp),
                        horizontalArrangement = Arrangement.SpaceAround,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        // My List
                        ActionIconItem(
                            icon = if (isSaved) Icons.Default.Check else Icons.Default.Add,
                            label = "My List",
                            isActive = isSaved,
                            onClick = onToggleMyList,
                            testTag = "detail_action_my_list"
                        )

                        // Rate
                        Box {
                            ActionIconItem(
                                icon = when (currentRating) {
                                    1 -> Icons.Default.ThumbUp
                                    2 -> Icons.Default.Favorite
                                    -1 -> Icons.Default.ThumbDown
                                    else -> Icons.Default.ThumbUp
                                },
                                label = when (currentRating) {
                                    1 -> "Liked"
                                    2 -> "Loved!"
                                    -1 -> "Disliked"
                                    else -> "Rate"
                                },
                                isActive = currentRating != 0,
                                onClick = { isRatingDropdownOpen = true },
                                testTag = "detail_action_rate"
                            )

                            DropdownMenu(
                                expanded = isRatingDropdownOpen,
                                onDismissRequest = { isRatingDropdownOpen = false },
                                modifier = Modifier
                                    .background(NetflixSurface)
                                    .border(1.dp, NetflixBorder, RoundedCornerShape(8.dp))
                            ) {
                                DropdownMenuItem(
                                    text = { Text("👍 Liked", color = Color.White) },
                                    onClick = {
                                        onRate(1)
                                        isRatingDropdownOpen = false
                                    }
                                )
                                DropdownMenuItem(
                                    text = { Text("❤️ Loved it!", color = Color.White) },
                                    onClick = {
                                        onRate(2)
                                        isRatingDropdownOpen = false
                                    }
                                )
                                DropdownMenuItem(
                                    text = { Text("👎 Not for me", color = Color.White) },
                                    onClick = {
                                        onRate(-1)
                                        isRatingDropdownOpen = false
                                    }
                                )
                            }
                        }

                        // Share
                        ActionIconItem(
                            icon = Icons.Default.Share,
                            label = "Share",
                            isActive = false,
                            onClick = { },
                            testTag = "detail_action_share"
                        )
                    }

                    Spacer(modifier = Modifier.height(8.dp))
                }
            }

            // Tabs: Episodes (if TV Show), More Like This, Trailers & More
            item {
                val tabs = if (media.episodes.isNotEmpty()) {
                    listOf("Episodes", "More Like This", "Trailers & More")
                } else {
                    listOf("More Like This", "Trailers & More")
                }

                TabRow(
                    selectedTabIndex = selectedTabIndex.coerceAtMost(tabs.size - 1),
                    containerColor = NetflixDarkBackground,
                    contentColor = NetflixRed,
                    indicator = { tabPositions ->
                        TabRowDefaults.SecondaryIndicator(
                            Modifier.tabIndicatorOffset(tabPositions[selectedTabIndex.coerceAtMost(tabs.size - 1)]),
                            color = NetflixRed,
                            height = 3.dp
                        )
                    }
                ) {
                    tabs.forEachIndexed { index, tabTitle ->
                        Tab(
                            selected = selectedTabIndex == index,
                            onClick = { selectedTabIndex = index },
                            text = {
                                Text(
                                    text = tabTitle,
                                    color = if (selectedTabIndex == index) Color.White else NetflixTextSecondary,
                                    fontSize = 13.sp,
                                    fontWeight = if (selectedTabIndex == index) FontWeight.Bold else FontWeight.Medium
                                )
                            }
                        )
                    }
                }
            }

            // Tab Content
            val effectiveTab = if (media.episodes.isEmpty() && selectedTabIndex == 0) 1 else selectedTabIndex

            when (effectiveTab) {
                0 -> {
                    // Episodes List
                    item {
                        // Season Selector
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(horizontal = 16.dp, vertical = 12.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Box {
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    modifier = Modifier
                                        .clip(RoundedCornerShape(6.dp))
                                        .background(NetflixSurfaceVariant)
                                        .border(0.5.dp, Color.White.copy(alpha = 0.1f), RoundedCornerShape(6.dp))
                                        .clickable { isSeasonDropdownOpen = true }
                                        .padding(horizontal = 12.dp, vertical = 6.dp)
                                ) {
                                    Text(
                                        text = "Season $selectedSeason",
                                        color = Color.White,
                                        fontSize = 13.sp,
                                        fontWeight = FontWeight.Bold
                                    )
                                    Icon(
                                        imageVector = Icons.Default.ArrowDropDown,
                                        contentDescription = null,
                                        tint = Color.White
                                    )
                                }

                                DropdownMenu(
                                    expanded = isSeasonDropdownOpen,
                                    onDismissRequest = { isSeasonDropdownOpen = false },
                                    modifier = Modifier
                                        .background(NetflixSurface)
                                        .border(1.dp, NetflixBorder, RoundedCornerShape(8.dp))
                                ) {
                                    (1..4).forEach { season ->
                                        DropdownMenuItem(
                                            text = {
                                                Text(
                                                    "Season $season",
                                                    color = if (selectedSeason == season) NetflixRed else Color.White
                                                )
                                            },
                                            onClick = {
                                                selectedSeason = season
                                                isSeasonDropdownOpen = false
                                            }
                                        )
                                    }
                                }
                            }
                        }
                    }

                    items(media.episodes, key = { it.id }) { episode ->
                        EpisodeCard(
                            episode = episode,
                            onPlayEpisode = onPlay
                        )
                    }
                }
                1 -> {
                    // More Like This Recommendation Grid
                    item {
                        val recommendations = CatalogData.allMediaItems.filter { it.id != media.id }.take(6)
                        Column(modifier = Modifier.padding(16.dp)) {
                            LazyVerticalGrid(
                                columns = GridCells.Fixed(3),
                                verticalArrangement = Arrangement.spacedBy(10.dp),
                                horizontalArrangement = Arrangement.spacedBy(8.dp),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(340.dp)
                            ) {
                                items(recommendations, key = { it.id }) { recItem ->
                                    NetflixPosterImage(
                                        imageUrl = recItem.posterUrl,
                                        contentDescription = recItem.title,
                                        isOriginal = recItem.isOriginal,
                                        modifier = Modifier
                                            .height(150.dp)
                                            .clickable { onSelectRecommended(recItem) }
                                    )
                                }
                            }
                        }
                    }
                }
                2 -> {
                    // Trailers & More
                    item {
                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(16.dp)
                        ) {
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(180.dp)
                                    .clip(RoundedCornerShape(10.dp))
                                    .border(1.dp, Color.White.copy(alpha = 0.1f), RoundedCornerShape(10.dp))
                                    .clickable { onPlay() }
                            ) {
                                AsyncImage(
                                    model = media.backdropUrl,
                                    contentDescription = "Trailer",
                                    contentScale = ContentScale.Crop,
                                    modifier = Modifier.fillMaxSize()
                                )
                                Box(
                                    modifier = Modifier
                                        .size(48.dp)
                                        .align(Alignment.Center)
                                        .clip(CircleShape)
                                        .background(Color.Black.copy(alpha = 0.7f)),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.PlayArrow,
                                        contentDescription = "Play Trailer",
                                        tint = Color.White,
                                        modifier = Modifier.size(32.dp)
                                    )
                                }
                            }
                            Spacer(modifier = Modifier.height(8.dp))
                            Text(
                                text = "${media.title} — ${media.videoSnippetTitle}",
                                color = Color.White,
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun ActionIconItem(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    label: String,
    isActive: Boolean,
    onClick: () -> Unit,
    testTag: String
) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier
            .clickable { onClick() }
            .padding(8.dp)
            .testTag(testTag)
    ) {
        Icon(
            imageVector = icon,
            contentDescription = label,
            tint = if (isActive) NetflixRed else Color.White,
            modifier = Modifier.size(24.dp)
        )
        Spacer(modifier = Modifier.height(4.dp))
        Text(
            text = label,
            color = if (isActive) NetflixRed else NetflixTextSecondary,
            fontSize = 11.sp,
            fontWeight = FontWeight.Medium
        )
    }
}

@Composable
private fun EpisodeCard(
    episode: Episode,
    onPlayEpisode: () -> Unit
) {
    var isDownloaded by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onPlayEpisode() }
            .padding(horizontal = 16.dp, vertical = 10.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Thumbnail
            Box(
                modifier = Modifier
                    .width(115.dp)
                    .height(68.dp)
                    .clip(RoundedCornerShape(8.dp))
                    .background(NetflixCardSurface)
                    .border(1.dp, Color.White.copy(alpha = 0.08f), RoundedCornerShape(8.dp))
            ) {
                AsyncImage(
                    model = episode.thumbnailUrl,
                    contentDescription = episode.title,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier.fillMaxSize()
                )
                Box(
                    modifier = Modifier
                        .size(28.dp)
                        .align(Alignment.Center)
                        .clip(CircleShape)
                        .background(Color.Black.copy(alpha = 0.65f)),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.PlayArrow,
                        contentDescription = null,
                        tint = Color.White,
                        modifier = Modifier.size(18.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.width(12.dp))

            // Episode Title & Duration
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = "${episode.episodeNumber}. ${episode.title}",
                    color = Color.White,
                    fontSize = 13.5.sp,
                    fontWeight = FontWeight.Bold,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
                Spacer(modifier = Modifier.height(2.dp))
                Text(
                    text = episode.duration,
                    color = NetflixTextSecondary,
                    fontSize = 11.sp
                )
            }

            // Download Icon
            IconButton(onClick = { isDownloaded = !isDownloaded }) {
                Icon(
                    imageVector = if (isDownloaded) Icons.Default.DownloadDone else Icons.Default.Download,
                    contentDescription = "Download Episode",
                    tint = if (isDownloaded) NetflixRed else Color.White,
                    modifier = Modifier.size(22.dp)
                )
            }
        }

        Spacer(modifier = Modifier.height(6.dp))

        // Episode Description
        Text(
            text = episode.description,
            color = NetflixTextSecondary,
            fontSize = 12.sp,
            lineHeight = 17.sp
        )
    }
}

