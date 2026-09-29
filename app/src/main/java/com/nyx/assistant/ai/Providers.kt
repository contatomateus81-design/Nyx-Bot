package com.nyx.assistant.ai
import com.nyx.assistant.domain.ChatMessage
import kotlinx.coroutines.flow.Flow
interface AiConversationProvider{suspend fun streamReply(history:List<ChatMessage>):Flow<String>}
interface SpeechToTextProvider{suspend fun start(onPartial:(String)->Unit,onFinal:(String)->Unit,onError:(String)->Unit);fun stop()}
interface TextToSpeechProvider{fun speak(text:String,onDone:()->Unit={},onError:(String)->Unit={});fun stop()}
interface RealtimeVoiceProvider{suspend fun connect();suspend fun sendAudio(chunk:ByteArray);suspend fun disconnect()}
interface DeviceActionExecutor{suspend fun execute(action:com.nyx.assistant.domain.DeviceAction):Result<Unit>}