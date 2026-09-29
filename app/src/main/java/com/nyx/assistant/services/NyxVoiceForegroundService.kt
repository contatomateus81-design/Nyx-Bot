package com.nyx.assistant.services
import android.app.*
import android.content.Intent
import android.os.IBinder
import android.content.pm.ServiceInfo
import androidx.core.app.NotificationCompat
import com.nyx.assistant.R
class NyxVoiceForegroundService:Service(){
 companion object{const val CHANNEL="nyx_voice";const val ACTION_STOP="com.nyx.assistant.STOP_VOICE"}
 override fun onCreate(){super.onCreate();createChannel()}
 override fun onStartCommand(intent:Intent?,flags:Int,startId:Int):Int{
  if(intent?.action==ACTION_STOP){stopSelf();return START_NOT_STICKY}
  val stop=PendingIntent.getService(this,1,Intent(this,NyxVoiceForegroundService::class.java).setAction(ACTION_STOP),PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT)
  val n=NotificationCompat.Builder(this,CHANNEL).setSmallIcon(R.drawable.ic_nyx).setContentTitle("Nyx está ouvindo").setContentText("O microfone está ativo.").setOngoing(true).addAction(R.drawable.ic_nyx,"Parar",stop).build()
  if(android.os.Build.VERSION.SDK_INT>=29)startForeground(1001,n,ServiceInfo.FOREGROUND_SERVICE_TYPE_MICROPHONE) else startForeground(1001,n)
  return START_NOT_STICKY
 }
 private fun createChannel(){if(android.os.Build.VERSION.SDK_INT>=26)getSystemService(NotificationManager::class.java).createNotificationChannel(NotificationChannel(CHANNEL,"Nyx — voz",NotificationManager.IMPORTANCE_LOW))}
 override fun onBind(intent:Intent?):IBinder?=null
}