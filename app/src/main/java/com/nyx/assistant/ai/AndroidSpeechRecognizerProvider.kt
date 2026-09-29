package com.nyx.assistant.ai
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.speech.RecognitionListener
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer
import kotlinx.coroutines.suspendCancellableCoroutine
import kotlin.coroutines.resume
class AndroidSpeechRecognizerProvider(private val context:Context):SpeechToTextProvider{
 private var recognizer:SpeechRecognizer?=null
 override suspend fun start(onPartial:(String)->Unit,onFinal:(String)->Unit,onError:(String)->Unit)=suspendCancellableCoroutine{cont->
  if(!SpeechRecognizer.isRecognitionAvailable(context)){onError("Reconhecimento de voz indisponível.");cont.resume(Unit);return@suspendCancellableCoroutine}
  recognizer?.destroy()
  recognizer=SpeechRecognizer.createSpeechRecognizer(context).apply{
   setRecognitionListener(object:RecognitionListener{
    override fun onReadyForSpeech(p:Bundle?)=Unit
    override fun onBeginningOfSpeech()=Unit
    override fun onRmsChanged(v:Float)=Unit
    override fun onBufferReceived(b:ByteArray?)=Unit
    override fun onEndOfSpeech()=Unit
    override fun onPartialResults(r:Bundle?){r?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)?.firstOrNull()?.let(onPartial)}
    override fun onResults(r:Bundle?){r?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)?.firstOrNull()?.let(onFinal);if(cont.isActive)cont.resume(Unit)}
    override fun onError(e:Int){onError("Falha de reconhecimento de voz.");if(cont.isActive)cont.resume(Unit)}
    override fun onEvent(t:Int,p:Bundle?)=Unit
   })
   startListening(Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply{putExtra(RecognizerIntent.EXTRA_LANGUAGE,"pt-BR");putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS,true);putExtra(RecognizerIntent.EXTRA_MAX_RESULTS,1)})
  }
  cont.invokeOnCancellation{stop()}
 }
 override fun stop(){recognizer?.stopListening();recognizer?.destroy();recognizer=null}
}