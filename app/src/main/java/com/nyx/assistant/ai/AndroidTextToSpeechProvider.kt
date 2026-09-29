package com.nyx.assistant.ai
import android.content.Context
import android.speech.tts.TextToSpeech
import java.util.Locale
class AndroidTextToSpeechProvider(context:Context):TextToSpeechProvider{
 private var ready=false
 private val tts=TextToSpeech(context){s->ready=s==TextToSpeech.SUCCESS;if(ready)tts.language=Locale("pt","BR")}
 override fun speak(text:String,onDone:()->Unit,onError:(String)->Unit){
  if(!ready){onError("Síntese de voz ainda não está pronta.");return}
  val id="nyx-"+System.nanoTime()
  if(tts.speak(text,TextToSpeech.QUEUE_FLUSH,null,id)==TextToSpeech.ERROR)onError("Falha no mecanismo de voz.")else onDone()
 }
 override fun stop(){tts.stop()}
}