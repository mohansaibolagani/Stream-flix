package com.example.ui.components

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
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.MoreVert
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
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
import com.example.data.model.MediaItem
import com.example.ui.theme.NetflixBorder
import com.example.ui.theme.NetflixCardSurface
import com.example.ui.theme.NetflixRed
import com.example.ui.theme.NetflixSurface
import com.example.ui.theme.NetflixTextPrimary
import com.example.ui.theme.NetflixTextSecondary

@Composable
fun ContinueWatchingRow(
    profileName: String,
    items: List<Pair<MediaItem, Float>>,
    onPlayItem: (MediaItem) -> Unit,
    onInfoClick: (MediaItem) -> Unit,
    onRemoveItem: (MediaItem) -> Unit,
    modifier: Modifier = Modifier
) {
    if (items.isEmpty()) return

    Column(
        modifier = modifier
            .fillMaxWidth()
            .padding(vertical = 10.dp)
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 6.dp)
        ) {
            Box(
                modifier = Modifier
                    .width(3.dp)
                    .height(14.dp)
                    .clip(RoundedCornerShape(1.5.dp))
                    .background(NetflixRed)
            )
            Spacer(modifier = Modifier.width(8.dp))
            Text(
                text = "Continue Watching for $profileName",
                color = NetflixTextPrimary,
                fontSize = 17.5.sp,
                fontWeight = FontWeight.Bold,
                letterSpacing = 0.2.sp
            )
        }

        LazyRow(
            contentPadding = PaddingValues(horizontal = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(items, key = { it.first.id }) { (item, progress) ->
                ContinueWatchingCard(
                    media = item,
                    progress = progress,
                    onPlay = { onPlayItem(item) },
                    onInfo = { onInfoClick(item) },
                    onRemove = { onRemoveItem(item) }
                )
            }
        }
    }
}

@Composable
private fun ContinueWatchingCard(
    media: MediaItem,
    progress: Float,
    onPlay: () -> Unit,
    onInfo: () -> Unit,
    onRemove: () -> Unit
) {
    var isMenuOpen by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .width(138.dp)
            .clip(RoundedCornerShape(10.dp))
            .background(NetflixCardSurface)
            .border(1.dp, Color.White.copy(alpha = 0.08f), RoundedCornerShape(10.dp))
            .testTag("continue_card_${media.id}")
    ) {
        // Thumbnail Box with Play overlay and progress bar
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(180.dp)
                .clickable { onPlay() }
        ) {
            AsyncImage(
                model = media.posterUrl,
                contentDescription = media.title,
                contentScale = ContentScale.Crop,
                modifier = Modifier.fillMaxSize()
            )

            // Play icon circular overlay
            Box(
                modifier = Modifier
                    .size(44.dp)
                    .align(Alignment.Center)
                    .clip(CircleShape)
                    .background(Color.Black.copy(alpha = 0.7f)),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.PlayArrow,
                    contentDescription = "Play",
                    tint = Color.White,
                    modifier = Modifier.size(28.dp)
                )
            }

            // Red Netflix Progress Bar
            LinearProgressIndicator(
                progress = { progress },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(3.5.dp)
                    .align(Alignment.BottomCenter),
                color = NetflixRed,
                trackColor = Color.White.copy(alpha = 0.25f)
            )
        }

        // Info & Options Footer
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 6.dp, vertical = 2.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(
                onClick = onInfo,
                modifier = Modifier.size(32.dp)
            ) {
                Icon(
                    imageVector = Icons.Default.Info,
                    contentDescription = "Info",
                    tint = NetflixTextSecondary,
                    modifier = Modifier.size(18.dp)
                )
            }

            Box {
                IconButton(
                    onClick = { isMenuOpen = true },
                    modifier = Modifier.size(32.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.MoreVert,
                        contentDescription = "More Options",
                        tint = NetflixTextSecondary,
                        modifier = Modifier.size(18.dp)
                    )
                }

                DropdownMenu(
                    expanded = isMenuOpen,
                    onDismissRequest = { isMenuOpen = false },
                    modifier = Modifier
                        .background(NetflixSurface)
                        .border(1.dp, NetflixBorder, RoundedCornerShape(8.dp))
                ) {
                    DropdownMenuItem(
                        text = { Text("Play from beginning", color = NetflixTextPrimary, fontSize = 13.sp) },
                        onClick = {
                            isMenuOpen = false
                            onPlay()
                        }
                    )
                    DropdownMenuItem(
                        text = { Text("Episode info", color = NetflixTextPrimary, fontSize = 13.sp) },
                        onClick = {
                            isMenuOpen = false
                            onInfo()
                        }
                    )
                    DropdownMenuItem(
                        text = { Text("Remove from row", color = NetflixRed, fontSize = 13.sp) },
                        onClick = {
                            isMenuOpen = false
                            onRemove()
                        }
                    )
                }
            }
        }
    }
}

