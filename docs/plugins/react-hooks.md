---
id: react-hooks
title: React Hooks
---

This plugin simplifies use of Iotes in functional components with [react hooks](https://reactjs.org/docs/hooks-intro.html)

## 1. Install

```bash
npm install @iotes/react-hooks
```

## 2. Import

```javascript
import { createIotes } from '@iotes/react-hooks'
```

## 3. Create

```javascript
const {useIotesDevice, useIotesHost} = createIotes({topology, strategy})
```

*Refer to the [quick start guide](/docs/introduction/getting-started) if you dont yet know what a topology and strategy is*

## 4. Use

```jsx
import { createTestStrategy } from '@iotes/strategy-test'
import { createDeviceDispatchable } from '@iotes/core'

const topology = {
  client: {
    name: 'iotesExample'
  },
  hosts: [{ name: 'TEST_HOST', host: 'localhost', port: '8888' }],
  devices: [
    {
        hostName: 'TEST_HOST',
        type: 'DEVICE_TYPE_ONE',
        name: 'DEVICE_ONE',
        channel: 1,
    },
    {
        hostName: 'TEST_HOST',
        type: 'DEVICE_TYPE_TWO',
        name: 'DEVICE_TWO',
        channel: 2,
    },
  ],
}


// This example uses createTestStrategy from @iotes/test-strategy to simulate a connection
// remote is a simulation of a remote device

const [ remote, strategy ] = createTestStrategy()
const { useIotesHost, useIotesDevice } = createIotes({
  topology,
  strategy,
})



const Component = () => {
  const [ hostState, hostDispatch ] = useIotesHost()
  const [ deviceState, deviceDispatch ] = useIotesDevice()

  const handleDataFrame = (data) => {
    remote.dispatch(
      createDeviceDispatchable('DEVICE_ONE', 'UPDATE', data)
    )
  }

  useEffect(() => {
    setInterval(
      () => handleDataFrame({value: Date.now()})
    , 1000)
  }, [])

  return (
    <p>Host State: {JSON.stringify(hostState)}<p>
    <p>Device State: {JSON.stringify(deviceState)}<p>
  )
}
```



