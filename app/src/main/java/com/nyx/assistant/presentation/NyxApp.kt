package com.nyx.assistant.presentation
import android.Manifest
import android.os.Build
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Mic
import androidx.compose.material.icons.filled.Send
import androidx.compose.material.icons.filled.Stop
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.nyx.assistant.domain.*
@Composable fun NyxApp(vm:MainViewModel=hiltViewModel()){
 var permissionAsked by remember{mutableStateOf(false)}
 val launcher=rememberLauncherForActivityResult(ActivityResultContracts.RequestPermission()){permissionAsked=true}
 LaunchedEffect(Unit){if(!permissionAsked && Build.VERSION.SDK_INT>=23)launcher.launch(Manifest.permission.RECORD_AUDIO)}
 NyxTheme{Surface(Modifier.fillMaxSize()){Home(vm)}}
}
@Composable private fun Home(vm:MainViewModel){
 val messages by vm.messages.collectAsState();val state by vm.state.collectAsState();val draft by vm.draft.collectAsState()
 Column(Modifier.fillMaxSize().padding(16.dp)){
  Text("Nyx",style=MaterialTheme.typography.headlineLarge,fontWeight=FontWeight.Bold,color=MaterialTheme.colorScheme.primary)
  Text(statusText(state),color=MaterialTheme.colorScheme.onSurfaceVariant)
  Spacer(Modifier.height(12.dp))
  Box(Modifier.fillMaxWidth().weight(1f),contentAlignment=Alignment.BottomCenter){
   if(messages.isEmpty())EmptyGreeting()
   else LazyColumn(Modifier.fillMaxWidth(),verticalArrangement=Arrangement.spacedBy(8.dp)){items(messages,key={it.id}){MessageBubble(it)}}
  }
  Spacer(Modifier.height(12.dp))
  Row(verticalAlignment=Alignment.CenterVertically,horizontalArrangement=Arrangement.spacedBy(8.dp)){
   OutlinedTextField(value=draft,onValueChange=vm::updateDraft,modifier=Modifier.weight(1f),placeholder={Text("Fale ou digite para a Nyx…")},shape=RoundedCornerShape(22.dp),singleLine=true)
   FilledIconButton(onClick={vm.sendText()},enabled=draft.isNotBlank()){Icon(Icons.Default.Send,"Enviar")}
  }
  Spacer(Modifier.height(10.dp))
  Row(Modifier.fillMaxWidth(),horizontalArrangement=Arrangement.Center){
   FilledIconButton(onClick={if(state==ConversationState.LISTENING)vm.stopListening() else vm.startListening()},modifier=Modifier.size(76.dp),shape=CircleShape){
    Icon(if(state==ConversationState.LISTENING)Icons.Default.Stop else Icons.Default.Mic,"Microfone",Modifier.size(34.dp))
   }
  }
 }
}
private fun statusText(s:ConversationState)=when(s){ConversationState.LISTENING->"Estou ouvindo…";ConversationState.PROCESSING->"Estou pensando…";ConversationState.RESPONDING->"Estou respondendo…";ConversationState.CONNECTION_ERROR->"Tive um problema de conexão.";else->"Pronta para conversar ✨"}
@Composable private fun EmptyGreeting(){Column(horizontalAlignment=Alignment.CenterHorizontally){Text("✦",style=MaterialTheme.typography.displayLarge,color=MaterialTheme.colorScheme.primary);Text("Oi! Eu sou a Nyx 💜",style=MaterialTheme.typography.headlineSmall);Text("Pode falar comigo ou escrever uma mensagem.",color=MaterialTheme.colorScheme.onSurfaceVariant)}}
@Composable private fun MessageBubble(m:ChatMessage){Row(Modifier.fillMaxWidth(),horizontalArrangement=if(m.role==Role.USER)Arrangement.End else Arrangement.Start){Surface(shape=RoundedCornerShape(18.dp),tonalElevation=2.dp,color=if(m.role==Role.USER)MaterialTheme.colorScheme.primaryContainer else MaterialTheme.colorScheme.surfaceVariant,modifier=Modifier.widthIn(max=330.dp)){Text(m.text,Modifier.padding(12.dp))}}}