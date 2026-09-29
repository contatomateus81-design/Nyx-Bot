package com.nyx.assistant.presentation
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.nyx.assistant.ai.*
import com.nyx.assistant.domain.*
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import java.util.UUID
import javax.inject.Inject
@HiltViewModel
class MainViewModel @Inject constructor(private val ai:AiConversationProvider,private val stt:SpeechToTextProvider,private val tts:TextToSpeechProvider):ViewModel(){
 private val _messages=MutableStateFlow<List<ChatMessage>>(emptyList());val messages=_messages.asStateFlow()
 private val _state=MutableStateFlow(ConversationState.IDLE);val state=_state.asStateFlow()
 private val _draft=MutableStateFlow("");val draft=_draft.asStateFlow()
 fun updateDraft(v:String){_draft.value=v}
 fun sendText(text:String=_draft.value){val clean=text.trim();if(clean.isEmpty())return;_draft.value="";_messages.update{it+ChatMessage(UUID.randomUUID().toString(),Role.USER,clean)};respond()}
 fun startListening(){_state.value=ConversationState.LISTENING;viewModelScope.launch{stt.start({_draft.value=it},{final->if(final.isNotBlank())sendText(final)},{_state.value=ConversationState.CONNECTION_ERROR})}}
 fun stopListening(){stt.stop();_state.value=ConversationState.IDLE}
 fun stopSpeaking(){tts.stop();_state.value=ConversationState.IDLE}
 private fun respond(){viewModelScope.launch{_state.value=ConversationState.PROCESSING;val id=UUID.randomUUID().toString();var answer="";_state.value=ConversationState.RESPONDING;ai.streamReply(_messages.value).collect{part->answer+=part;_messages.update{list->list.filterNot{it.id==id}+ChatMessage(id,Role.ASSISTANT,answer,System.currentTimeMillis(),true)}};tts.speak(answer){_state.value=ConversationState.IDLE}}}
}