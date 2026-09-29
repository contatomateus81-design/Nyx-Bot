package com.nyx.assistant.ai
import com.nyx.assistant.domain.*
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import javax.inject.Inject
class LocalAiProvider @Inject constructor():AiConversationProvider{
 override suspend fun streamReply(history:List<ChatMessage>):Flow<String>=flow{
  val text=history.lastOrNull{it.role==Role.USER}?.text.orEmpty()
  val reply=when{
   text.isBlank()->"Oi! Eu sou a Nyx. Pode falar comigo. ✨"
   text.contains("seu nome",true)->"Eu sou a Nyx. Prazer em conversar com você! 💜"
   else->"Entendi. Estou no modo local: ainda não há um modelo remoto conectado. A arquitetura já está preparada para um provedor de IA por streaming."
  }
  reply.forEach{emit(it.toString())}
 }
}