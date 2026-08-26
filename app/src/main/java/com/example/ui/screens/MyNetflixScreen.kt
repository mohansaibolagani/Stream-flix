package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowForwardIos
import androidx.compose.material.icons.filled.DeleteOutline
import androidx.compose.material.icons.filled.Download
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.example.data.local.SavedMediaEntity
import com.example.data.model.MediaItem
import com.example.data.model.MediaType
import com.example.data.model.Profile
import com.example.ui.components.ContinueWatchingRow
import com.example.ui.components.NetflixPosterImage
import com.example.ui.theme.NetflixCardSurface
import com.example.ui.theme.NetflixDarkBackground
import com.example.ui.theme.NetflixMatchGreen
import com.example.ui.theme.NetflixRed
import com.example.ui.theme.NetflixSurface
import com.example.ui.theme.NetflixSurfaceVariant
import com.example.ui.theme.NetflixTextPrimary
import com.example.ui.theme.NetflixTextSecondary

@Composable
fun MyNetflixScreen(
    activeProfile: Profile,
    profiles: List<Profile>,
    myList: List<MediaItem>,
    downloads: List<Pair<MediaItem, SavedMediaEntity>>,
    continueWatchingList: List<Pair<MediaItem, Float>>,
    onSelectProfile: (Profile) -> Unit,
    onOpenMediaDetail: (MediaItem) -> Unit,
    onPlayMedia: (MediaItem) -> Unit,
    onToggleDownload: (String) -> Unit,
    onRemoveContinueWatching: (String) -> Unit,
    onOpenSettings: () -> Unit,
    modifier: Modifier = Modifier
) {
    var myListFilterIndex by remember { mutableIntStateOf(0) }
    val myListFilters = listOf("All", "TV Shows", "Movies")

    val filteredMyList = when (myListFilterIndex) {
        1 -> myList.filter { it.type == MediaType.TV_SHOW }
        2 -> myList.filter { it.type == MediaType.MOVIE }
        else -> myList
    }

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .background(NetflixDarkBackground)
            .statusBarsPadding(),
        contentPadding = PaddingValues(bottom = 90.dp)
    ) {
        // Profile Switcher Header
        item {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 16.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // Active Profile Avatar
                Box(
                    modifier = Modifier
                        .size(76.dp)
                        .clip(RoundedCornerShape(14.dp))
                        .background(Color(activeProfile.avatarColor))
                        .border(2.dp, NetflixRed, RoundedCornerShape(14.dp)),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = activeProfile.iconEmoji,
                        fontSize = 38.sp
                    )
                }

                Spacer(modifier = Modifier.height(10.dp))

                Text(
                    text = activeProfile.name,
                    color = Color.White,
                    fontSize = 19.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 0.2.sp
                )

                Spacer(modifier = Modifier.height(16.dp))

                // Profile Switcher Horizontal Row
                LazyRow(
                    contentPadding = PaddingValues(horizontal = 16.dp),
                    horizontalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    items(profiles) { profile ->
                        val isSelected = profile.id == activeProfile.id
                        Column(
                            horizontalAlignment = Alignment.CenterHorizontally,
                            modifier = Modifier
                                .clickable { onSelectProfile(profile) }
                                .padding(4.dp)
                                .testTag("profile_item_${profile.id}")
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(48.dp)
                                    .clip(RoundedCornerShape(10.dp))
                                    .background(Color(profile.avatarColor))
                                    .border(
                                        width = if (isSelected) 2.dp else 1.dp,
                                        color = if (isSelected) NetflixRed else Color.White.copy(alpha = 0.15f),
                                        shape = RoundedCornerShape(10.dp)
                                    ),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(text = profile.iconEmoji, fontSize = 22.sp)
                            }
                            Spacer(modifier = Modifier.height(6.dp))
                            Text(
                                text = profile.name,
                                color = if (isSelected) Color.White else NetflixTextSecondary,
                                fontSize = 11.5.sp,
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium
                            )
                        }
                    }
                }
            }
        }

        // Downloads Manager Section
        item {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 10.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .width(3.dp)
                                .height(14.dp)
                                .clip(RoundedCornerShape(1.5.dp))
                                .background(NetflixRed)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "Downloads (${downloads.size})",
                            color = Color.White,
                            fontSize = 17.5.sp,
                            fontWeight = FontWeight.Bold,
                            letterSpacing = 0.2.sp
                        )
                    }

                    Text(
                        text = "Smart Downloads ON",
                        color = NetflixMatchGreen,
                        fontSize = 11.5.sp,
                        fontWeight = FontWeight.SemiBold
                    )
                }

                Spacer(modifier = Modifier.height(10.dp))

                // Storage Meter Bar
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(10.dp))
                        .background(NetflixSurface)
                        .border(1.dp, Color.White.copy(alpha = 0.08f), RoundedCornerShape(10.dp))
                        .padding(14.dp)
                ) {
                    Column {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(
                                text = "Device Storage (StreamFlix: 4.8 GB)",
                                color = NetflixTextSecondary,
                                fontSize = 12.sp
                            )
                            Text(
                                text = "58.2 GB Free",
                                color = NetflixTextPrimary,
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                        Spacer(modifier = Modifier.height(8.dp))
                        LinearProgressIndicator(
                            progress = { 0.28f },
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(6.dp)
                                .clip(RoundedCornerShape(3.dp)),
                            color = NetflixRed,
                            trackColor = NetflixSurfaceVariant
                        )
                    }
                }

                Spacer(modifier = Modifier.height(8.dp))

                // Downloaded Items list
                downloads.forEach { (media, entity) ->
                    DownloadedMediaItemRow(
                        media = media,
                        size = entity.downloadedSizeMb,
                        onPlay = { onPlayMedia(media) },
                        onDelete = { onToggleDownload(media.id) },
                        onClick = { onOpenMediaDetail(media) }
                    )
                }
            }
        }

        // Continue Watching Row (if any)
        if (continueWatchingList.isNotEmpty()) {
            item {
                ContinueWatchingRow(
                    profileName = activeProfile.name,
                    items = continueWatchingList,
                    onPlayItem = onPlayMedia,
                    onInfoClick = onOpenMediaDetail,
                    onRemoveItem = { onRemoveContinueWatching(it.id) }
                )
            }
        }

        // My List Section (Room DB)
        item {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 12.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .width(3.dp)
                                .height(14.dp)
                                .clip(RoundedCornerShape(1.5.dp))
                                .background(NetflixRed)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "My List (${myList.size})",
                            color = Color.White,
                            fontSize = 17.5.sp,
                            fontWeight = FontWeight.Bold,
                            letterSpacing = 0.2.sp
                        )
                    }

                    // Filter chips for My List
                    Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                        myListFilters.forEachIndexed { index, filter ->
                            val isSelected = myListFilterIndex == index
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(16.dp))
                                    .background(if (isSelected) NetflixRed else NetflixSurfaceVariant)
                                    .border(
                                        1.dp,
                                        if (isSelected) Color.Transparent else Color.White.copy(alpha = 0.08f),
                                        RoundedCornerShape(16.dp)
                                    )
                                    .clickable { myListFilterIndex = index }
                                    .padding(horizontal = 12.dp, vertical = 4.dp)
                            ) {
                                Text(
                                    text = filter,
                                    color = if (isSelected) Color.White else NetflixTextSecondary,
                                    fontSize = 11.5.sp,
                                    fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium
                                )
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                if (filteredMyList.isEmpty()) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(110.dp)
                            .clip(RoundedCornerShape(10.dp))
                            .background(NetflixSurface)
                            .border(1.dp, Color.White.copy(alpha = 0.08f), RoundedCornerShape(10.dp)),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "No titles in your list yet.\nTap '+' on any movie or show to add it.",
                            color = NetflixTextSecondary,
                            fontSize = 13.sp,
                            textAlign = androidx.compose.ui.text.style.TextAlign.Center,
                            lineHeight = 18.sp
                        )
                    }
                } else {
                    LazyVerticalGrid(
                        columns = GridCells.Fixed(3),
                        horizontalArrangement = Arrangement.spacedBy(10.dp),
                        verticalArrangement = Arrangement.spacedBy(10.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(((filteredMyList.size / 3 + 1) * 165).dp)
                    ) {
                        items(filteredMyList, key = { it.id }) { item ->
                            NetflixPosterImage(
                                imageUrl = item.posterUrl,
                                contentDescription = item.title,
                                isOriginal = item.isOriginal,
                                modifier = Modifier
                                    .height(155.dp)
                                    .clickable { onOpenMediaDetail(item) }
                                    .testTag("my_list_item_${item.id}")
                            )
                        }
                    }
                }
            }
        }

        // App Settings & Preferences
        item {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 14.dp)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .width(3.dp)
                            .height(14.dp)
                            .clip(RoundedCornerShape(1.5.dp))
                            .background(NetflixRed)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "App Settings",
                        color = Color.White,
                        fontSize = 17.5.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 0.2.sp
                    )
                }

                Spacer(modifier = Modifier.height(10.dp))

                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(12.dp))
                        .background(NetflixSurface)
                        .border(1.dp, Color.White.copy(alpha = 0.08f), RoundedCornerShape(12.dp))
                        .padding(horizontal = 14.dp, vertical = 4.dp)
                ) {
                    Column {
                        SettingMenuRow(title = "Video Quality", subtitle = "Ultra HD 4K (Best)", onClick = onOpenSettings)
                        SettingMenuRow(title = "Wi-Fi Only Downloads", subtitle = "Enabled (Saves mobile data)", onClick = onOpenSettings)
                        SettingMenuRow(title = "Audio & Subtitles Default", subtitle = "English (Original) with CC", onClick = onOpenSettings)
                        SettingMenuRow(title = "Account & Privacy", subtitle = "alex.member@streamflix.com", onClick = onOpenSettings)
                    }
                }
            }
        }
    }
}

@Composable
private fun DownloadedMediaItemRow(
    media: MediaItem,
    size: String,
    onPlay: () -> Unit,
    onDelete: () -> Unit,
    onClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp)
            .clip(RoundedCornerShape(10.dp))
            .background(NetflixSurface)
            .border(1.dp, Color.White.copy(alpha = 0.08f), RoundedCornerShape(10.dp))
            .clickable { onClick() }
            .padding(8.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Box(
            modifier = Modifier
                .width(84.dp)
                .height(50.dp)
                .clip(RoundedCornerShape(6.dp))
                .background(NetflixCardSurface)
                .border(1.dp, Color.White.copy(alpha = 0.08f), RoundedCornerShape(6.dp))
        ) {
            AsyncImage(
                model = media.backdropUrl,
                contentDescription = media.title,
                contentScale = ContentScale.Crop,
                modifier = Modifier.fillMaxSize()
            )
        }

        Spacer(modifier = Modifier.width(12.dp))

        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = media.title,
                color = Color.White,
                fontSize = 13.5.sp,
                fontWeight = FontWeight.Bold
            )
            Spacer(modifier = Modifier.height(2.dp))
            Text(
                text = "$size • Ready to watch offline",
                color = NetflixTextSecondary,
                fontSize = 11.sp
            )
        }

        IconButton(onClick = onPlay) {
            Icon(
                imageVector = Icons.Default.PlayArrow,
                contentDescription = "Play offline",
                tint = Color.White,
                modifier = Modifier.size(24.dp)
            )
        }

        IconButton(onClick = onDelete) {
            Icon(
                imageVector = Icons.Default.DeleteOutline,
                contentDescription = "Delete download",
                tint = NetflixTextSecondary,
                modifier = Modifier.size(20.dp)
            )
        }
    }
}

@Composable
private fun SettingMenuRow(
    title: String,
    subtitle: String,
    onClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() }
            .padding(vertical = 10.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column {
            Text(
                text = title,
                color = Color.White,
                fontSize = 13.5.sp,
                fontWeight = FontWeight.Medium
            )
            Spacer(modifier = Modifier.height(2.dp))
            Text(
                text = subtitle,
                color = NetflixTextSecondary,
                fontSize = 11.5.sp
            )
        }
        Icon(
            imageVector = Icons.AutoMirrored.Filled.ArrowForwardIos,
            contentDescription = null,
            tint = NetflixTextSecondary,
            modifier = Modifier.size(13.dp)
        )
    }
}

