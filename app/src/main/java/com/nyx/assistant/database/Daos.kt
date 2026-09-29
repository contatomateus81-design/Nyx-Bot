package com.nyx.assistant.database
import androidx.room.*
import kotlinx.coroutines.flow.Flow
@Dao interface ConversationDao{
 @Query("SELECT * FROM conversations WHERE archived=0 ORDER BY updatedAt DESC") fun observeAll():Flow<List<ConversationEntity>>
 @Insert(onConflict=OnConflictStrategy.REPLACE) suspend fun upsert(item:ConversationEntity)
 @Query("DELETE FROM conversations") suspend fun deleteAll()
}
@Dao interface MessageDao{
 @Query("SELECT * FROM messages WHERE conversationId=:conversationId ORDER BY timestamp ASC") fun observe(conversationId:String):Flow<List<MessageEntity>>
 @Insert(onConflict=OnConflictStrategy.REPLACE) suspend fun upsert(item:MessageEntity)
 @Query("DELETE FROM messages") suspend fun deleteAll()
}
@Dao interface DeviceActionDao{
 @Insert(onConflict=OnConflictStrategy.REPLACE) suspend fun upsert(item:DeviceActionEntity)
 @Query("SELECT * FROM device_actions ORDER BY createdAt DESC") fun observe():Flow<List<DeviceActionEntity>>
}