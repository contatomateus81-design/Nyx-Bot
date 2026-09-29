package com.nyx.assistant.database
import androidx.room.Database
import androidx.room.RoomDatabase
@Database(entities=[ConversationEntity::class,MessageEntity::class,DeviceActionEntity::class],version=1,exportSchema=false)
abstract class NyxDatabase:RoomDatabase(){abstract fun conversations():ConversationDao;abstract fun messages():MessageDao;abstract fun actions():DeviceActionDao}