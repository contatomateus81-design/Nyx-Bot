package com.nyx.assistant.di
import android.content.Context
import androidx.room.Room
import com.nyx.assistant.database.NyxDatabase
import com.nyx.assistant.settings.NyxSettings
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton
@Module @InstallIn(SingletonComponent::class)
object DatabaseModule{
 @Provides @Singleton fun database(@ApplicationContext c:Context):NyxDatabase=Room.databaseBuilder(c,NyxDatabase::class.java,"nyx.db").build()
 @Provides @Singleton fun settings(@ApplicationContext c:Context)=NyxSettings(c)
}