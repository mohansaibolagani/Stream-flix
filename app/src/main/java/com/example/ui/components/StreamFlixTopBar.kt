package com.example.ui.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowDropDown
import androidx.compose.material.icons.filled.Cast
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.Profile
import com.example.ui.theme.NetflixBorder
import com.example.ui.theme.NetflixBorderSubtle
import com.example.ui.theme.NetflixRed
import com.example.ui.theme.NetflixSurface
import com.example.ui.theme.NetflixTextPrimary
import com.example.ui.theme.NetflixTextSecondary
import com.example.ui.viewmodel.HeaderFilter

@Composable
fun StreamFlixTopBar(
    currentFilter: HeaderFilter,
    selectedCategoryGenre: String?,
    activeProfile: Profile,
    profiles: List<Profile>,
    isProfileMenuOpen: Boolean,
    onFilterSelected: (HeaderFilter) -> Unit,
    onOpenCategoryPicker: () -> Unit,
    onClearCategory: () -> Unit,
    onToggleProfileMenu: (Boolean) -> Unit,
    onProfileSelected: (Profile) -> Unit,
    onSearchClick: () -> Unit,
    onCastClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .fillMaxWidth()
            .background(
                Brush.verticalGradient(
                    colors = listOf(
                        Color(0xFF0A0A0A).copy(alpha = 0.95f),
                        Color(0xFF0A0A0A).copy(alpha = 0.7f),
                        Color.Transparent
                    )
                )
            )
            .statusBarsPadding()
            .padding(horizontal = 16.dp, vertical = 6.dp)
    ) {
        // Main Row: Logo, Search, Cast, Profile
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Netflix Red "N" Logo with Editorial Typography
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier
                    .clip(RoundedCornerShape(8.dp))
                    .clickable { onFilterSelected(HeaderFilter.ALL) }
                    .padding(4.dp)
                    .testTag("app_logo_button")
            ) {
                Box(
                    modifier = Modifier
                        .size(34.dp)
                        .clip(RoundedCornerShape(8.dp))
                        .background(Color(0xFF141414))
                        .border(1.dp, NetflixRed.copy(alpha = 0.4f), RoundedCornerShape(8.dp)),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "N",
                        color = NetflixRed,
                        fontSize = 24.sp,
                        fontWeight = FontWeight.Black
                    )
                }
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "STREAMFLIX",
                    color = Color.White,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Black,
                    letterSpacing = 1.5.sp
                )
            }

            // Actions: Cast, Search, Profile Avatar
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                IconButton(
                    onClick = onCastClick,
                    modifier = Modifier
                        .size(36.dp)
                        .clip(CircleShape)
                        .background(Color.White.copy(alpha = 0.08f))
                        .testTag("cast_button")
                ) {
                    Icon(
                        imageVector = Icons.Default.Cast,
                        contentDescription = "Cast to TV",
                        tint = Color.White,
                        modifier = Modifier.size(18.dp)
                    )
                }

                IconButton(
                    onClick = onSearchClick,
                    modifier = Modifier
                        .size(36.dp)
                        .clip(CircleShape)
                        .background(Color.White.copy(alpha = 0.08f))
                        .testTag("topbar_search_button")
                ) {
                    Icon(
                        imageVector = Icons.Default.Search,
                        contentDescription = "Search",
                        tint = Color.White,
                        modifier = Modifier.size(18.dp)
                    )
                }

                // Profile Avatar Box with Dropdown
                Box {
                    Box(
                        modifier = Modifier
                            .size(36.dp)
                            .clip(RoundedCornerShape(8.dp))
                            .background(Color(activeProfile.avatarColor))
                            .border(1.dp, Color.White.copy(alpha = 0.25f), RoundedCornerShape(8.dp))
                            .clickable { onToggleProfileMenu(true) }
                            .testTag("profile_avatar_button"),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = activeProfile.iconEmoji,
                            fontSize = 18.sp
                        )
                    }

                    DropdownMenu(
                        expanded = isProfileMenuOpen,
                        onDismissRequest = { onToggleProfileMenu(false) },
                        modifier = Modifier
                            .background(NetflixSurface)
                            .border(1.dp, NetflixBorder, RoundedCornerShape(12.dp))
                    ) {
                        Text(
                            text = "WHO'S WATCHING?",
                            color = NetflixTextSecondary,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            letterSpacing = 1.sp,
                            modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)
                        )
                        profiles.forEach { profile ->
                            DropdownMenuItem(
                                text = {
                                    Row(
                                        verticalAlignment = Alignment.CenterVertically,
                                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                                    ) {
                                        Box(
                                            modifier = Modifier
                                                .size(26.dp)
                                                .clip(RoundedCornerShape(6.dp))
                                                .background(Color(profile.avatarColor)),
                                            contentAlignment = Alignment.Center
                                        ) {
                                            Text(text = profile.iconEmoji, fontSize = 13.sp)
                                        }
                                        Text(
                                            text = profile.name + if (profile.isKids) " (Kids)" else "",
                                            color = if (profile.id == activeProfile.id) NetflixRed else NetflixTextPrimary,
                                            fontWeight = if (profile.id == activeProfile.id) FontWeight.Bold else FontWeight.Normal
                                        )
                                        if (profile.id == activeProfile.id) {
                                            Icon(
                                                imageVector = Icons.Default.Check,
                                                contentDescription = "Active",
                                                tint = NetflixRed,
                                                modifier = Modifier.size(16.dp)
                                            )
                                        }
                                    }
                                },
                                onClick = { onProfileSelected(profile) }
                            )
                        }
                    }
                }
            }
        }

        // Sub Filter Row: TV Shows, Movies, Categories (Editorial pill tags)
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = 10.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            CategoryChip(
                text = "TV Shows",
                isSelected = currentFilter == HeaderFilter.TV_SHOWS,
                onClick = {
                    if (currentFilter == HeaderFilter.TV_SHOWS) onFilterSelected(HeaderFilter.ALL)
                    else onFilterSelected(HeaderFilter.TV_SHOWS)
                }
            )

            CategoryChip(
                text = "Movies",
                isSelected = currentFilter == HeaderFilter.MOVIES,
                onClick = {
                    if (currentFilter == HeaderFilter.MOVIES) onFilterSelected(HeaderFilter.ALL)
                    else onFilterSelected(HeaderFilter.MOVIES)
                }
            )

            CategoryChip(
                text = selectedCategoryGenre ?: "Categories",
                isSelected = currentFilter == HeaderFilter.CATEGORIES || selectedCategoryGenre != null,
                hasDropdown = true,
                onClick = onOpenCategoryPicker
            )

            if (selectedCategoryGenre != null || currentFilter != HeaderFilter.ALL) {
                IconButton(
                    onClick = {
                        onFilterSelected(HeaderFilter.ALL)
                        onClearCategory()
                    },
                    modifier = Modifier.size(28.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.Close,
                        contentDescription = "Clear Filter",
                        tint = NetflixTextSecondary,
                        modifier = Modifier.size(16.dp)
                    )
                }
            }
        }
    }
}

@Composable
private fun CategoryChip(
    text: String,
    isSelected: Boolean,
    hasDropdown: Boolean = false,
    onClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .clip(RoundedCornerShape(20.dp))
            .background(if (isSelected) NetflixRed else Color(0xFF1C1C1E).copy(alpha = 0.85f))
            .border(
                1.dp,
                if (isSelected) NetflixRed else Color.White.copy(alpha = 0.15f),
                RoundedCornerShape(20.dp)
            )
            .clickable { onClick() }
            .padding(horizontal = 14.dp, vertical = 6.dp),
        contentAlignment = Alignment.Center
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(4.dp)
        ) {
            Text(
                text = text,
                color = if (isSelected) Color.White else NetflixTextPrimary,
                fontSize = 12.5.sp,
                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium
            )
            if (hasDropdown) {
                Icon(
                    imageVector = Icons.Default.ArrowDropDown,
                    contentDescription = null,
                    tint = if (isSelected) Color.White else NetflixTextSecondary,
                    modifier = Modifier.size(16.dp)
                )
            }
        }
    }
}

