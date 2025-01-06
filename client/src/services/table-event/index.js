import * as EventEmitter from 'eventemitter3'

const tableEvent = new EventEmitter()
let ws
let healthCheckTimer

export function connectionSuccess(socket) {
  ws = socket
  // eslint-disable-next-line
  healthCheckTimer = window.setInterval(function() {
    heartbeat()
  }, 25 * 1000)
}

function heartbeat() {
  sendCmd({
    id: makeid(8),
    cmd: 'heartbeat',
    data: '',
  })
}

function makeid(length) {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  // eslint-disable-next-line
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export function cmdSelectTable(tables) {
  sendCmd({
    id: makeid(8),
    cmd: 'select_table',
    data: tables,
  })
}

function sendCmd(payload) {
  if (ws) {
    ws.send(JSON.stringify(payload))
  }
}

export function incomingEvent(payload) {
  const ev = JSON.parse(payload)
  console.log(ev)
  if (ev.status === 0 && ev.resp === 'table_event') {
    if (ev.message.table_number) {
      tableEvent.emit(`table_event_${ev.message.table_number}`, ev.message)
    }
  }
}

export function connectionError(error) {
  console.log(`Websocket Error: ${error}`)
}

export function disconnectSuccess() {
  console.log('Websocket disconnected')
}

export function disconnect() {
  console.log('Closing Websocket coonnection')
  clearInterval(healthCheckTimer)
  ws.close()
}

export default tableEvent
