package com.nyx.assistant.di
import android.content.Context
import com.nyx.assistant.ai.*
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton
@Module @InstallIn(SingletonComponent::class)
object AppModule{
 @Provides @Singleton fun ai():AiConversationProvider=LocalAiProvider()
 @Provides @Singleton fun stt(@ApplicationContext c:Context):SpeechToTextProvider=AndroidSpeechRecognizerProvider(c)
 @Provides @Singleton fun tts(@ApplicationContext c:Context):TextToSpeechProvider=AndroidTextToSpeechProvider(c)
 @Provides @Singleton fun actions(@ApplicationContext c:Context):DeviceActionExecutor=AndroidDeviceActionExecutor(c)
}