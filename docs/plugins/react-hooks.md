---
id: react-hooks
title: React Hooks
---

This plugin simplifies use of Iotes in functional components with (react hooks)[https://reactjs.org/docs/hooks-intro.html]

## 1. Install

```bash
npm install iotes-react-hooks
```

## 2. Import

```javascript
import { createIotes } from
```

## 3. Create

```javascript
const {useIotesDevice, useIotesHost} = createIotes({topology, strategy})
```

*Refer to the [quick start guide](/docs/introduction/getting-started) if you dont yet know what a topology and strategy is.*

## 4. Use

```jsx
const Component = () => {
  const [ hostState, setHostState ] = useState({}) 
  const [ deviceState, setDeviceState ] = useState({})

  useIotesHost((state) => setHostState(state['YourHostName]')) 
  useIotesDevice((state) => setDeviceState(state['YourDeviceName]'))

  return (
    <p>Host State: {JSON.stringify(hostState)}<p>
    <p>Device State: {JSON.stringify(deviceState)}<p>
  )
}
```



