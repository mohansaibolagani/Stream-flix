package com.example.ui.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Cast
import androidx.compose.material.icons.filled.FastForward
import androidx.compose.material.icons.filled.FastRewind
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.LockOpen
import androidx.compose.material.icons.filled.Pause
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Replay10
import androidx.compose.material.icons.filled.SkipNext
import androidx.compose.material.icons.filled.Speed
import androidx.compose.material.icons.filled.Subtitles
import androidx.compose.material.icons.filled.VolumeMute
import androidx.compose.material.icons.filled.VolumeUp
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.RadioButton
import androidx.compose.material3.RadioButtonDefaults
import androidx.compose.material3.Slider
import androidx.compose.material3.SliderDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
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
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.example.data.model.MediaItem
import com.example.ui.theme.NetflixBlack
import com.example.ui.theme.NetflixCardSurface
import com.example.ui.theme.NetflixRed
import com.example.ui.theme.NetflixSurface
import com.example.ui.theme.NetflixTextPrimary
import com.example.ui.theme.NetflixTextSecondary
import com.example.ui.viewmodel.VideoPlaybackState
import kotlinx.coroutines.delay

@Composable
fun VideoPlayerView(
    media: MediaItem,
    playbackState: VideoPlaybackState,
    onClosePlayer: () -> Unit,
    onTogglePlayPause: () -> Unit,
    onSeekRelative: (Int) -> Unit,
    onSeekToFraction: (Float) -> Unit,
    onSetSpeed: (Float) -> Unit,
    onSetAudioAndSubtitle: (String, String) -> Unit,
    modifier: Modifier = Modifier
) {
    var areControlsVisible by remember { mutableStateOf(true) }
    var isControlsLocked by remember { mutableStateOf(false) }
    var isAudioModalOpen by remember { mutableStateOf(false) }
    var isSpeedModalOpen by remember { mutableStateOf(false) }

    // Simulated playback ticker when isPlaying is true
    var currentSeconds by remember(playbackState.currentPositionSeconds) {
        mutableIntStateOf(playbackState.currentPositionSeconds)
    }

    LaunchedEffect(playbackState.isPlaying) {
        while (playbackState.isPlaying) {
            delay(1000)
            currentSeconds = (currentSeconds + 1).coerceAtMost(playbackState.totalDurationSeconds)
        }
    }

    // Auto-hide controls after 4 seconds of inactivity
    LaunchedEffect(areControlsVisible, playbackState.isPlaying) {
        if (areControlsVisible && playbackState.isPlaying && !isControlsLocked) {
            delay(4000)
            areControlsVisible = false
        }
    }

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(NetflixBlack)
            .clickable(
                interactionSource = remember { MutableInteractionSource() },
                indication = null
            ) {
                areControlsVisible = !areControlsVisible
            }
            .testTag("video_player_view")
    ) {
        // Video backdrop preview simulation with animated pulsing light
        AsyncImage(
            model = media.backdropUrl,
            contentDescription = media.title,
            contentScale = ContentScale.Crop,
            modifier = Modifier.fillMaxSize()
        )

        // Dark dimming overlay when controls are visible
        AnimatedVisibility(
            visible = areControlsVisible,
            enter = fadeIn(),
            exit = fadeOut(),
            modifier = Modifier.fillMaxSize()
        ) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(Color.Black.copy(alpha = 0.65f))
            )
        }

        // Overlay Controls
        AnimatedVisibility(
            visible = areControlsVisible,
            enter = fadeIn(),
            exit = fadeOut(),
            modifier = Modifier.fillMaxSize()
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .statusBarsPadding()
                    .navigationBarsPadding()
                    .padding(16.dp),
                verticalArrangement = Arrangement.SpaceBetween
            ) {
                // Top Action Bar
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    IconButton(
                        onClick = onClosePlayer,
                        modifier = Modifier.testTag("player_close_button")
                    ) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                            contentDescription = "Back",
                            tint = Color.White,
                            modifier = Modifier.size(28.dp)
                        )
                    }

                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(
                            text = media.title,
                            color = Color.White,
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold
                        )
                        if (media.episodes.isNotEmpty()) {
                            Text(
                                text = "S4:E1 \"${media.episodes.first().title}\"",
                                color = NetflixTextSecondary,
                                fontSize = 12.sp
                            )
                        }
                    }

                    Row(verticalAlignment = Alignment.CenterVertically) {
                        IconButton(onClick = { isSpeedModalOpen = true }) {
                            Icon(
                                imageVector = Icons.Default.Speed,
                                contentDescription = "Speed",
                                tint = Color.White
                            )
                        }
                        IconButton(onClick = { isControlsLocked = !isControlsLocked }) {
                            Icon(
                                imageVector = if (isControlsLocked) Icons.Default.Lock else Icons.Default.LockOpen,
                                contentDescription = "Lock Controls",
                                tint = if (isControlsLocked) NetflixRed else Color.White
                            )
                        }
                    }
                }

                // Center Play / Pause / 10s Rewind & Forward Controls
                if (!isControlsLocked) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceEvenly,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        // -10s Skip
                        IconButton(
                            onClick = {
                                onSeekRelative(-10)
                                currentSeconds = (currentSeconds - 10).coerceAtLeast(0)
                            },
                            modifier = Modifier.size(56.dp).testTag("rewind_10_button")
                        ) {
                            Icon(
                                imageVector = Icons.Default.Replay10,
                                contentDescription = "10s Back",
                                tint = Color.White,
                                modifier = Modifier.size(40.dp)
                            )
                        }

                        // Play/Pause Big Center Toggle
                        Box(
                            modifier = Modifier
                                .size(72.dp)
                                .clip(CircleShape)
                                .background(Color.White.copy(alpha = 0.2f))
                                .clickable { onTogglePlayPause() }
                                .testTag("player_play_pause_button"),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = if (playbackState.isPlaying) Icons.Default.Pause else Icons.Default.PlayArrow,
                                contentDescription = if (playbackState.isPlaying) "Pause" else "Play",
                                tint = Color.White,
                                modifier = Modifier.size(48.dp)
                            )
                        }

                        // +10s Skip
                        IconButton(
                            onClick = {
                                onSeekRelative(10)
                                currentSeconds = (currentSeconds + 10).coerceAtMost(playbackState.totalDurationSeconds)
                            },
                            modifier = Modifier.size(56.dp).testTag("forward_10_button")
                        ) {
                            Icon(
                                imageVector = Icons.Default.FastForward,
                                contentDescription = "10s Forward",
                                tint = Color.White,
                                modifier = Modifier.size(40.dp)
                            )
                        }
                    }
                } else {
                    Spacer(modifier = Modifier.height(10.dp))
                }

                // Bottom Timeline, Scrub Bar, and Audio/Subtitle selector
                Column(modifier = Modifier.fillMaxWidth()) {
                    // Scrub slider
                    val progressFraction = (currentSeconds.toFloat() / playbackState.totalDurationSeconds.toFloat()).coerceIn(0f, 1f)

                    Slider(
                        value = progressFraction,
                        onValueChange = { fraction ->
                            currentSeconds = (fraction * playbackState.totalDurationSeconds).toInt()
                            onSeekToFraction(fraction)
                        },
                        colors = SliderDefaults.colors(
                            thumbColor = NetflixRed,
                            activeTrackColor = NetflixRed,
                            inactiveTrackColor = Color.White.copy(alpha = 0.3f)
                        ),
                        modifier = Modifier.fillMaxWidth().testTag("player_timeline_slider")
                    )

                    // Time labels
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(
                            text = formatTime(currentSeconds),
                            color = Color.White,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Medium
                        )
                        val remainingSeconds = playbackState.totalDurationSeconds - currentSeconds
                        Text(
                            text = "-${formatTime(remainingSeconds)}",
                            color = NetflixTextSecondary,
                            fontSize = 12.sp
                        )
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    // Bottom Navigation Buttons
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        // Audio & Subtitles
                        TextButton(
                            onClick = { isAudioModalOpen = true },
                            modifier = Modifier.testTag("audio_subtitles_button")
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(6.dp)
                            ) {
                                Icon(
                                    imageVector = Icons.Default.Subtitles,
                                    contentDescription = null,
                                    tint = Color.White,
                                    modifier = Modifier.size(18.dp)
                                )
                                Text(
                                    text = "Audio & Subtitles",
                                    color = Color.White,
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Medium
                                )
                            }
                        }

                        // Next Episode button (if TV Show)
                        if (media.episodes.isNotEmpty()) {
                            TextButton(onClick = {
                                currentSeconds = 0
                                onSeekToFraction(0f)
                            }) {
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(4.dp)
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.SkipNext,
                                        contentDescription = null,
                                        tint = Color.White,
                                        modifier = Modifier.size(20.dp)
                                    )
                                    Text(
                                        text = "Next Ep",
                                        color = Color.White,
                                        fontSize = 12.sp,
                                        fontWeight = FontWeight.Medium
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    // Audio & Subtitle Language Selector Dialog
    if (isAudioModalOpen) {
        AudioSubtitleDialog(
            currentAudio = playbackState.audioTrack,
            currentSubtitle = playbackState.subtitleTrack,
            onDismiss = { isAudioModalOpen = false },
            onApply = { audio, subtitle ->
                onSetAudioAndSubtitle(audio, subtitle)
                isAudioModalOpen = false
            }
        )
    }

    // Speed Modal Dialog
    if (isSpeedModalOpen) {
        SpeedSelectDialog(
            currentSpeed = playbackState.playbackSpeed,
            onDismiss = { isSpeedModalOpen = false },
            onSelectSpeed = {
                onSetSpeed(it)
                isSpeedModalOpen = false
            }
        )
    }
}

@Composable
private fun AudioSubtitleDialog(
    currentAudio: String,
    currentSubtitle: String,
    onDismiss: () -> Unit,
    onApply: (String, String) -> Unit
) {
    val audioOptions = listOf("English [Original] (5.1)", "Spanish (5.1)", "French", "Japanese", "German")
    val subtitleOptions = listOf("Off", "English [CC]", "Spanish", "French", "German", "Japanese")

    var selectedAudio by remember { mutableStateOf(currentAudio) }
    var selectedSubtitle by remember { mutableStateOf(currentSubtitle) }

    AlertDialog(
        onDismissRequest = onDismiss,
        containerColor = NetflixSurface,
        title = {
            Text(
                text = "Audio & Subtitles",
                color = NetflixTextPrimary,
                fontWeight = FontWeight.Bold,
                fontSize = 18.sp
            )
        },
        text = {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                // Audio Column
                Column(modifier = Modifier.weight(1f).padding(end = 8.dp)) {
                    Text(
                        text = "AUDIO",
                        color = NetflixRed,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 1.sp
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    audioOptions.forEach { audio ->
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier
                                .fillMaxWidth()
                                .clickable { selectedAudio = audio }
                                .padding(vertical = 4.dp)
                        ) {
                            RadioButton(
                                selected = selectedAudio.startsWith(audio.take(7)),
                                onClick = { selectedAudio = audio },
                                colors = RadioButtonDefaults.colors(selectedColor = NetflixRed)
                            )
                            Text(
                                text = audio,
                                color = if (selectedAudio.startsWith(audio.take(7))) Color.White else NetflixTextSecondary,
                                fontSize = 12.sp
                            )
                        }
                    }
                }

                // Subtitles Column
                Column(modifier = Modifier.weight(1f).padding(start = 8.dp)) {
                    Text(
                        text = "SUBTITLES",
                        color = NetflixRed,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 1.sp
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    subtitleOptions.forEach { sub ->
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier
                                .fillMaxWidth()
                                .clickable { selectedSubtitle = sub }
                                .padding(vertical = 4.dp)
                        ) {
                            RadioButton(
                                selected = selectedSubtitle.startsWith(sub.take(3)),
                                onClick = { selectedSubtitle = sub },
                                colors = RadioButtonDefaults.colors(selectedColor = NetflixRed)
                            )
                            Text(
                                text = sub,
                                color = if (selectedSubtitle.startsWith(sub.take(3))) Color.White else NetflixTextSecondary,
                                fontSize = 12.sp
                            )
                        }
                    }
                }
            }
        },
        confirmButton = {
            Button(
                onClick = { onApply(selectedAudio, selectedSubtitle) },
                colors = ButtonDefaults.buttonColors(containerColor = NetflixRed)
            ) {
                Text("Apply", color = Color.White)
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Cancel", color = NetflixTextSecondary)
            }
        }
    )
}

@Composable
private fun SpeedSelectDialog(
    currentSpeed: Float,
    onDismiss: () -> Unit,
    onSelectSpeed: (Float) -> Unit
) {
    val speeds = listOf(0.5f, 0.75f, 1.0f, 1.25f, 1.5f)

    AlertDialog(
        onDismissRequest = onDismiss,
        containerColor = NetflixSurface,
        title = {
            Text(
                text = "Playback Speed",
                color = NetflixTextPrimary,
                fontWeight = FontWeight.Bold,
                fontSize = 18.sp
            )
        },
        text = {
            Column {
                speeds.forEach { speed ->
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { onSelectSpeed(speed) }
                            .padding(vertical = 6.dp)
                    ) {
                        RadioButton(
                            selected = currentSpeed == speed,
                            onClick = { onSelectSpeed(speed) },
                            colors = RadioButtonDefaults.colors(selectedColor = NetflixRed)
                        )
                        Text(
                            text = if (speed == 1.0f) "1.0x (Normal)" else "${speed}x",
                            color = if (currentSpeed == speed) NetflixRed else NetflixTextPrimary,
                            fontSize = 14.sp,
                            fontWeight = if (currentSpeed == speed) FontWeight.Bold else FontWeight.Normal
                        )
                    }
                }
            }
        },
        confirmButton = {
            TextButton(onClick = onDismiss) {
                Text("Done", color = NetflixRed)
            }
        }
    )
}

private fun formatTime(seconds: Int): String {
    val mins = seconds / 60
    val secs = seconds % 60
    return String.format("%02d:%02d", mins, secs)
}
