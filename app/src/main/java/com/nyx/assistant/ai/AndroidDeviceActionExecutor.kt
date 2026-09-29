package com.nyx.assistant.ai
import android.content.Context
import android.content.Intent
import android.provider.Settings
import com.nyx.assistant.domain.DeviceAction
class AndroidDeviceActionExecutor(private val context:Context):DeviceActionExecutor{
 override suspend fun execute(action:DeviceAction)=runCatching{
  when(action.type){
   "settings"->context.startActivity(Intent(Settings.ACTION_SETTINGS).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK))
   "browser"->context.startActivity(Intent(Intent.ACTION_VIEW,android.net.Uri.parse(action.target ?: "https://www.google.com")).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK))
   else->error("Ação sem executor nativo.")
  }
 }
}