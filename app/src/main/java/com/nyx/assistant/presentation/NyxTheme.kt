package com.nyx.assistant.presentation
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
private val Purple=Color(0xFF7B3FC6)
private val Lilac=Color(0xFFB98BEA)
private val Lavender=Color(0xFFE8D9FF)
private val Light=Color(0xFFFAF7FF)
private val Dark=Color(0xFF292235)
private val LightScheme=lightColorScheme(primary=Purple,secondary=Lilac,tertiary=Color(0xFFF5B6D2),background=Light,surface=Color.White,onBackground=Dark,onSurface=Dark)
private val DarkScheme=darkColorScheme(primary=Color(0xFFB98BEA),secondary=Purple,tertiary=Color(0xFFF5B6D2))
@Composable fun NyxTheme(dark:Boolean=false,content:@Composable()->Unit){MaterialTheme(colorScheme=if(dark)DarkScheme else LightScheme,typography=Typography(),content=content)}