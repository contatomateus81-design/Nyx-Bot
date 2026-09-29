package com.nyx.assistant.settings
import android.content.Context
import androidx.datastore.preferences.core.*
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.map
private val Context.nyxDataStore by preferencesDataStore("nyx_settings")
class NyxSettings(private val context:Context){
 companion object{val USER_NAME=stringPreferencesKey("user_name");val LANGUAGE=stringPreferencesKey("language");val VOICE_SPEED=floatPreferencesKey("voice_speed");val PERSONALITY=stringPreferencesKey("personality");val BACKGROUND=booleanPreferencesKey("background");val THEME=stringPreferencesKey("theme");val ASSISTANT_NAME=stringPreferencesKey("assistant_name")}
 val settings=context.nyxDataStore.data.map{p->NyxSettingsSnapshot(p[USER_NAME].orEmpty(),p[LANGUAGE]?:"pt-BR",p[VOICE_SPEED]?:1f,p[PERSONALITY]?:"carinhosa",p[BACKGROUND]?:false,p[THEME]?:"system",p[ASSISTANT_NAME]?:"Nyx")}
 suspend fun setName(v:String)=context.nyxDataStore.edit{it[USER_NAME]=v}
}
data class NyxSettingsSnapshot(val userName:String,val language:String,val voiceSpeed:Float,val personality:String,val background:Boolean,val theme:String,val assistantName:String)