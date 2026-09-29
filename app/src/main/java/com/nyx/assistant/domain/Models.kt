package com.nyx.assistant.domain
data class ChatMessage(val id:String,val role:Role,val text:String,val timestamp:Long=System.currentTimeMillis(),val streaming:Boolean=false)
enum class Role{USER,ASSISTANT,SYSTEM}
enum class ConversationState{IDLE,PREPARING_MIC,LISTENING,PROCESSING,RESPONDING,CONNECTION_ERROR,MIC_PERMISSION_REQUIRED,PAUSED,AWAITING_CONFIRMATION}
data class UserSettings(val name:String="",val language:String="pt-BR",val voiceId:String?=null,val voiceSpeed:Float=1f,val personalityMode:String="carinhosa",val backgroundServiceEnabled:Boolean=false,val themeMode:String="system",val emojis:Boolean=true,val assistantName:String="Nyx")
data class DeviceAction(val type:String,val target:String?,val description:String,val requiresConfirmation:Boolean=true)