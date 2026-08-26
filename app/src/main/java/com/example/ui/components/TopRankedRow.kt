package com.example.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Shadow
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.MediaItem
import com.example.ui.theme.NetflixRed
import com.example.ui.theme.NetflixTextPrimary

@Composable
fun TopRankedRow(
    title: String,
    items: List<MediaItem>,
    onItemClick: (MediaItem) -> Unit,
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
                text = title,
                color = NetflixTextPrimary,
                fontSize = 17.5.sp,
                fontWeight = FontWeight.Bold,
                letterSpacing = 0.2.sp
            )
        }

        LazyRow(
            contentPadding = PaddingValues(horizontal = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            itemsIndexed(items.take(10), key = { _, item -> item.id }) { index, item ->
                val rank = index + 1
                Box(
                    modifier = Modifier
                        .width(150.dp)
                        .height(172.dp)
                        .clickable { onItemClick(item) }
                        .testTag("top_ranked_item_$rank")
                ) {
                    // Giant Stylized Rank Number behind/overlapping poster
                    Text(
                        text = "$rank",
                        style = TextStyle(
                            fontSize = 98.sp,
                            fontWeight = FontWeight.Black,
                            color = Color(0xFF404040),
                            shadow = Shadow(
                                color = Color.Black,
                                blurRadius = 14f
                            )
                        ),
                        modifier = Modifier
                            .align(Alignment.BottomStart)
                            .offset(x = (-4).dp, y = 16.dp)
                    )

                    // Secondary Stroke effect with white highlight
                    Text(
                        text = "$rank",
                        style = TextStyle(
                            fontSize = 98.sp,
                            fontWeight = FontWeight.Black,
                            color = Color(0xFF1C1C1E)
                        ),
                        modifier = Modifier
                            .align(Alignment.BottomStart)
                            .offset(x = (-2).dp, y = 16.dp)
                    )

                    // Poster placed offset to right
                    NetflixPosterImage(
                        imageUrl = item.posterUrl,
                        contentDescription = item.title,
                        isOriginal = item.isOriginal,
                        modifier = Modifier
                            .align(Alignment.CenterEnd)
                            .width(112.dp)
                            .height(164.dp)
                    )
                }
            }
        }
    }
}

