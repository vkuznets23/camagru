'use client'

import { useState, useRef, useEffect, memo, useCallback } from 'react'
import { RiSendPlaneFill } from 'react-icons/ri'
import styles from '@/styles/MessageInput.module.css'

interface MessageInputProps {
  onSendMessage: (message: string) => void
  onTyping?: (isTyping: boolean) => void
  disabled?: boolean
  placeholder?: string
  maxLength?: number
}

function MessageInput({
  onSendMessage,
  onTyping,
  disabled = false,
  placeholder = 'Type a message...',
  maxLength = 1000,
}: MessageInputProps) {
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [message])

  // Handle typing indicator
  useEffect(() => {
    if (message.trim() && onTyping) {
      onTyping(true)

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }

      // Set new timeout to stop typing indicator
      typingTimeoutRef.current = setTimeout(() => {
        onTyping(false)
      }, 1000)
    } else if (onTyping) {
      onTyping(false)
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [message, onTyping])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value
      if (value.length <= maxLength) {
        setMessage(value)
      }
    },
    [maxLength]
  )

  const handleSend = useCallback(() => {
    const trimmedMessage = message.trim()
    if (trimmedMessage && !disabled) {
      onSendMessage(trimmedMessage)
      setMessage('')
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }, [message, disabled, onSendMessage])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    },
    [handleSend]
  )

  const isMessageEmpty = !message.trim()
  const isNearLimit = message.length > maxLength * 0.8
  const isAtLimit = message.length >= maxLength

  return (
    <div className={styles.inputContainer}>
      <div className={styles.inputWrapper}>
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={styles.messageTextarea}
          disabled={disabled}
          rows={1}
        />

        {isNearLimit && (
          <div
            className={`${styles.characterCount} ${
              isAtLimit ? styles.error : styles.warning
            }`}
          >
            {message.length}/{maxLength}
          </div>
        )}
      </div>

      <button
        onClick={handleSend}
        className={styles.sendButton}
        disabled={disabled || isMessageEmpty}
        type="button"
        aria-label="Send message"
      >
        <RiSendPlaneFill />
      </button>
    </div>
  )
}

export default memo(MessageInput)
