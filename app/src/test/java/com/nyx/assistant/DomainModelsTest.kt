package com.nyx.assistant
import com.nyx.assistant.domain.*
import org.junit.Assert.assertEquals
import org.junit.Test
class DomainModelsTest{
 @Test fun defaultAssistantNameIsNyx(){assertEquals("Nyx",UserSettings().assistantName)}
 @Test fun messageRoleIsPreserved(){val m=ChatMessage("1",Role.USER,"oi");assertEquals(Role.USER,m.role)}
}