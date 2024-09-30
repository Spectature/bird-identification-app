import type { Ref } from 'vue'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useWebSocket } from '@vueuse/core'
import { EventSourcePolyfill } from 'event-source-polyfill'

// 定义 WebSocketStatus 类型，使用全大写的字符串字面值
type WebSocketStatus = 'OPEN' | 'CLOSED' | 'CONNECTING' | 'ERROR'

// TypeScript 定义
type ConnectionType = 'webSocket' | 'sse'

// 定义 HeartbeatConfig 类型
export interface HeartbeatConfig {
  interval: number
  message: string
  confirmMessage?: string // 心跳响应确认消息，默认 'pong'
}

// 定义 WebSocketProperties 类型，包括 reconnect 和 heartbeat
export interface WebSocketProperties {
  reconnect?: boolean
  heartbeat?: HeartbeatOption
}

// 类型定义
type HeartbeatOption = boolean | HeartbeatConfig

export interface SocketCallback {
  onConnected?: (ws: WebSocket) => void
  onDisconnected?: (ws: WebSocket, event: CloseEvent) => void
  onError?: (ws: WebSocket, event: Event) => void
  onMessage?: (ws: WebSocket, event: MessageEvent) => void
}
export interface sseSocketCallback {
  onConnected?: (ws: string) => void
  onError?: (event: string) => void
  onMessage?: (event: string) => void
}

export function createWebSocketConnection(
  url: string,
  token: string,
  webProps?: WebSocketProperties,
  config: HeartbeatConfig | null = null,
  callbacks: SocketCallback = {}
) {
  const { reconnect, heartbeat } = webProps || {}
  const { onConnected, onDisconnected, onError, onMessage } = callbacks

  const {
    status,
    send: useSend,
    close,
    ws
  } = useWebSocket(`${url}?token=${token}`, {
    autoReconnect: reconnect,
    onConnected: () => {
      if (onConnected && ws.value) onConnected(ws.value)
    },
    onDisconnected: (webs, event) => {
      if (onDisconnected && ws.value) {
        onDisconnected(webs, event)
      }
    },
    onError: (webs, event) => {
      if (onError && ws.value) {
        onError(webs, event)
      }
    }
  })

  // 创建一个新的 Ref 来存储非心跳消息的数据
  const data: Ref<any> = ref(null)

  // 配置 send 默认 header 参数
  const send = (type: string, body: any) => {
    const sendValue = {
      header: {
        type,
        version: '1.0',
        timestamp: Date.now()
      },
      body
    }
    useSend(JSON.stringify(sendValue))
  }

  // 设置心跳间隔和消息
  let heartbeatInterval: number
  let heartbeatMessage: string
  const confirmMessage = config?.confirmMessage ?? 'pong'

  if (typeof heartbeat === 'object' && heartbeat !== null) {
    heartbeatInterval = heartbeat.interval
    heartbeatMessage = JSON.stringify({
      header: {
        type: heartbeat.message,
        version: '1.0',
        timestamp: Date.now()
      }
    })
  } else {
    heartbeatInterval = config?.interval ?? 30000 // 默认 30 秒
    heartbeatMessage = JSON.stringify({
      header: {
        type: config?.message ?? 'ping',
        version: '1.0',
        timestamp: Date.now()
      }
    })
  }

  // 判断是否启用心跳 heartbeat（默认开启）
  if (heartbeat) {
    setInterval(() => {
      if (status.value === 'OPEN') {
        useSend(heartbeatMessage)
      }
    }, heartbeatInterval)
  }

  // 监听消息事件，处理心跳消息和其他消息
  ws.value?.addEventListener('message', (event) => {
    if (JSON.parse(event.data).header.type !== confirmMessage) {
      data.value = JSON.parse(event.data)
      if (onMessage) onMessage(ws.value!, event) // 仅传递非心跳消息给外部回调
    }
  })

  // 将 status 映射为自定义状态定义
  const state: Ref<WebSocketStatus> = computed(() => {
    switch (status.value) {
      case 'OPEN':
        return 'OPEN'
      case 'CLOSED':
        return 'CLOSED'
      case 'CONNECTING':
        return 'CONNECTING'
      default:
        return 'ERROR'
    }
  })

  return { data, state, send, close }
}

export function createSSEConnection(url: string, token: string, callbacks: sseSocketCallback = {}) {
  const data = ref<any>(null)
  const state: Ref<string> = ref('CONNECTING')
  const eventSource = ref<EventSource | null>(null)
  const { onConnected, onError, onMessage } = callbacks

  onMounted(() => {
    eventSource.value = new EventSourcePolyfill(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    eventSource.value!.onopen = () => {
      if (onConnected) onConnected('OPEN')
      state.value = 'OPEN'
    }

    eventSource.value!.onmessage = (event) => {
      data.value = JSON.parse(event.data)
      if (onMessage) onMessage(JSON.parse(event.data))
    }

    eventSource.value!.onerror = () => {
      if (onError) onError('ERROR')
      state.value = 'ERROR'
    }
  })

  const close = () => {
    if (eventSource.value) {
      eventSource.value.close()
      eventSource.value = null
      state.value = 'CLOSED'
    }
  }

  onUnmounted(() => {
    close()
  })

  return { data, state, close }
}

export function usePersistentConnection(
  url: string,
  token: string,
  type: ConnectionType,
  callbacks: SocketCallback | sseSocketCallback = {},
  webProps?: WebSocketProperties
) {
  switch (type) {
    case 'webSocket':
      return createWebSocketConnection(url, token, webProps, null, callbacks as SocketCallback)
    case 'sse': {
      const { data, state, close } = createSSEConnection(url, token, callbacks as sseSocketCallback)
      const send = () => {
        console.warn('SSE does not support sending messages')
      }
      return { data, state, send, close }
    }
    default:
      throw new Error('Unsupported connection type')
  }
}
