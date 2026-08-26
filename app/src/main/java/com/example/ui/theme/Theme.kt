package com.example.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val NetflixDarkColorScheme =
  darkColorScheme(
    primary = NetflixRed,
    onPrimary = Color.White,
    primaryContainer = NetflixRedDark,
    onPrimaryContainer = Color.White,
    secondary = NetflixTextSecondary,
    onSecondary = Color.White,
    tertiary = NetflixMatchGreen,
    onTertiary = Color.Black,
    background = NetflixBlack,
    onBackground = NetflixTextPrimary,
    surface = NetflixSurface,
    onSurface = NetflixTextPrimary,
    surfaceVariant = NetflixSurfaceVariant,
    onSurfaceVariant = NetflixTextSecondary,
    outline = NetflixBorder,
    outlineVariant = NetflixCardSurface
  )

@Composable
fun MyApplicationTheme(
  darkTheme: Boolean = true, // Netflix is always dark & cinematic by default
  dynamicColor: Boolean = false,
  content: @Composable () -> Unit,
) {
  MaterialTheme(
    colorScheme = NetflixDarkColorScheme,
    typography = Typography,
    content = content
  )
}

