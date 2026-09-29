package com.nyx.assistant.database
import androidx.room.Entity
import androidx.room.PrimaryKey
@Entity(tableName="conversations") data class ConversationEntity(@PrimaryKey val id:String,val title:String,val createdAt:Long,val updatedAt:Long,val archived:Boolean=false)
@Entity(tableName="messages") data class MessageEntity(@PrimaryKey val id:String,val conversationId:String,val role:String,val text:String,val timestamp:Long,val audioUri:String?=null,val streaming:Boolean=false,val sensitive:Boolean=false)
@Entity(tableName="device_actions") data class DeviceActionEntity(@PrimaryKey val id:String,val type:String,val targetApplication:String?,val description:String,val status:String,val requiresConfirmation:Boolean,val createdAt:Long,val executedAt:Long?)