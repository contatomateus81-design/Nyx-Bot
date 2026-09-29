package com.nyx.assistant.services
import android.content.Context
import android.content.Intent
import androidx.core.content.ContextCompat
object VoiceServiceController{
 fun start(context:Context){ContextCompat.startForegroundService(context,Intent(context,NyxVoiceForegroundService::class.java))}
 fun stop(context:Context){context.stopService(Intent(context,NyxVoiceForegroundService::class.java))}
}