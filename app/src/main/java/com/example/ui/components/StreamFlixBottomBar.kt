package com.example.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Whatshot
import androidx.compose.material.icons.outlined.Home
import androidx.compose.material.icons.outlined.Search
import androidx.compose.material.icons.outlined.Whatshot
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.Profile
import com.example.ui.theme.NetflixDarkBackground
import com.example.ui.theme.NetflixRed
import com.example.ui.theme.NetflixTextSecondary
import com.example.ui.viewmodel.AppTab

@Composable
fun StreamFlixBottomBar(
    activeTab: AppTab,
    activeProfile: Profile,
    onTabSelected: (AppTab) -> Unit,
    modifier: Modifier = Modifier
) {
    NavigationBar(
        containerColor = NetflixDarkBackground,
        contentColor = Color.White,
        tonalElevation = 0.dp,
        modifier = modifier
            .fillMaxWidth()
            .border(width = 0.5.dp, color = Color.White.copy(alpha = 0.08f))
            .navigationBarsPadding()
            .testTag("main_bottom_nav")
    ) {
        // 1. Home
        NavigationBarItem(
            selected = activeTab == AppTab.HOME,
            onClick = { onTabSelected(AppTab.HOME) },
            icon = {
                Icon(
                    imageVector = if (activeTab == AppTab.HOME) Icons.Filled.Home else Icons.Outlined.Home,
                    contentDescription = "Home"
                )
            },
            label = {
                Text(
                    text = "Home",
                    fontSize = 10.5.sp,
                    fontWeight = if (activeTab == AppTab.HOME) FontWeight.Bold else FontWeight.Medium
                )
            },
            colors = NavigationBarItemDefaults.colors(
                selectedIconColor = Color.White,
                selectedTextColor = Color.White,
                unselectedIconColor = NetflixTextSecondary,
                unselectedTextColor = NetflixTextSecondary,
                indicatorColor = NetflixRed.copy(alpha = 0.22f)
            ),
            modifier = Modifier.testTag("nav_tab_home")
        )

        // 2. Search & Games
        NavigationBarItem(
            selected = activeTab == AppTab.SEARCH,
            onClick = { onTabSelected(AppTab.SEARCH) },
            icon = {
                Icon(
                    imageVector = if (activeTab == AppTab.SEARCH) Icons.Filled.Search else Icons.Outlined.Search,
                    contentDescription = "Search"
                )
            },
            label = {
                Text(
                    text = "Search",
                    fontSize = 10.5.sp,
                    fontWeight = if (activeTab == AppTab.SEARCH) FontWeight.Bold else FontWeight.Medium
                )
            },
            colors = NavigationBarItemDefaults.colors(
                selectedIconColor = Color.White,
                selectedTextColor = Color.White,
                unselectedIconColor = NetflixTextSecondary,
                unselectedTextColor = NetflixTextSecondary,
                indicatorColor = NetflixRed.copy(alpha = 0.22f)
            ),
            modifier = Modifier.testTag("nav_tab_search")
        )

        // 3. New & Hot
        NavigationBarItem(
            selected = activeTab == AppTab.NEW_AND_HOT,
            onClick = { onTabSelected(AppTab.NEW_AND_HOT) },
            icon = {
                Icon(
                    imageVector = if (activeTab == AppTab.NEW_AND_HOT) Icons.Filled.Whatshot else Icons.Outlined.Whatshot,
                    contentDescription = "New & Hot"
                )
            },
            label = {
                Text(
                    text = "New & Hot",
                    fontSize = 10.5.sp,
                    fontWeight = if (activeTab == AppTab.NEW_AND_HOT) FontWeight.Bold else FontWeight.Medium
                )
            },
            colors = NavigationBarItemDefaults.colors(
                selectedIconColor = Color.White,
                selectedTextColor = Color.White,
                unselectedIconColor = NetflixTextSecondary,
                unselectedTextColor = NetflixTextSecondary,
                indicatorColor = NetflixRed.copy(alpha = 0.22f)
            ),
            modifier = Modifier.testTag("nav_tab_new_and_hot")
        )

        // 4. My Netflix
        NavigationBarItem(
            selected = activeTab == AppTab.MY_NETFLIX,
            onClick = { onTabSelected(AppTab.MY_NETFLIX) },
            icon = {
                Box(
                    modifier = Modifier
                        .size(26.dp)
                        .clip(RoundedCornerShape(6.dp))
                        .background(Color(activeProfile.avatarColor))
                        .border(
                            width = if (activeTab == AppTab.MY_NETFLIX) 2.dp else 0.dp,
                            color = if (activeTab == AppTab.MY_NETFLIX) NetflixRed else Color.Transparent,
                            shape = RoundedCornerShape(6.dp)
                        ),
                    contentAlignment = Alignment.Center
                ) {
                    Text(text = activeProfile.iconEmoji, fontSize = 13.sp)
                }
            },
            label = {
                Text(
                    text = "My Netflix",
                    fontSize = 10.5.sp,
                    fontWeight = if (activeTab == AppTab.MY_NETFLIX) FontWeight.Bold else FontWeight.Medium
                )
            },
            colors = NavigationBarItemDefaults.colors(
                selectedIconColor = Color.White,
                selectedTextColor = Color.White,
                unselectedIconColor = NetflixTextSecondary,
                unselectedTextColor = NetflixTextSecondary,
                indicatorColor = NetflixRed.copy(alpha = 0.22f)
            ),
            modifier = Modifier.testTag("nav_tab_my_netflix")
        )
    }
}

