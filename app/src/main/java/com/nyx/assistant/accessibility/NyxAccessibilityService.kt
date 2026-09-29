package com.nyx.assistant.accessibility
import android.accessibilityservice.AccessibilityService
import android.view.accessibility.AccessibilityEvent
class NyxAccessibilityService:AccessibilityService(){
 override fun onAccessibilityEvent(event:AccessibilityEvent?){}
 override fun onInterrupt(){}
}