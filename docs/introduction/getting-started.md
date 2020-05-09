---
id: getting-started
title: Quick Start
sidebar_label: Quick Start
---

Iotes is an iot adapter for JavaScript applications.

It helps you write applications that connect to IOT services, using a number of protocols, in a predictable way that's easy to use with declaritive application frameworks.

You can use Iotes core alone, or use it with [plugins](/docs/introduction/core-concepts#plugins) that provide bindings to popular libraries 

This quick start is a basic example that uses the [mqtt strategy](/docs/strategies/mqtt) to connect two devices to the [mosquitto](mosquitto.org) public mqtt broker.

## Quick Start

### 1. Install

#### NPM

```
npm install iotes
```

or:

#### Yarn

```
yarn add iotes
```

For more information see the [installation](./installation) page

### 2. Import packages

```javascript
import { createIotes } from 'iotes'
// This example uses mqtt through the mqtt strategy
import { mqttStategy } from 'iotes-strategy-mqtt' 
```

### 3. Define connection topology

```javascript
// Iotes uses a topology map to declare which devices should be connected
const topology = {
  client: { 
    // The name of your client using iotes
    name: 'clientName' 
  }, 
  hosts: [{
    // A name for you to identify a unique host
    name: 'exampleHost', 
    // Both host name and port will have different 
    // requirements depending on the strategy used
    host: 'ws://localhost', 
    port: '8888', 
  }], 
  devices: [
      {
        // The host which the device whould be connected to
        hostName: 'exampleHost',
        // One of the device types supported by a given strategy. 
        // See Strategy docs for avaliable types.
        type: 'EXAMPLE_TYPE', 
        // The unique name for this device
        name: 'DEVICE_1', 
      },
      {
        hostName: 'exampleHost',
        type: 'EXAMPLE_TYPE',
        name: 'DEVICE_2', 
      },
  ],
}
```

### 4. Create an Iotes instance 

```javascript
// This example connects to mqtt using the basic mqtt strategy
const iotes = createIotes({
  topology, 
  strategy: mqttStrategy
}) 
```

### 5. Subscribe and Dispatch

```javascript
// You can use hostSubscribe() or deviceSubscribe() 
// to respond to changes on the devices or the host.
// Normally you'd use a view binding plugin 
// (e.g. React Hooks) rather than subscribe() directly.

iotes.deviceSubscribe(state => console.log(state))
iotes.hostSubscribe(state => console.log(state))

// You can use hostDispatch() or deviceDispatch() 
// to send information to the device or the host.
iotes.deviceDispatch({
  'DEVICE_1':{  
    payload:{
      message: 'new information'
    }
  }
})

```

## All Together Now
  Same example but all together

  ```javascript
  import { createIotes } from 'iotes'
  import { mqttStategy } from 'iotes-strategy-mqtt' 

  const topology = {
  client: { 
    name: 'clientName' 
  }, 
  hosts: [{
    name: 'exampleHost', 
    host: 'ws://localhost', 
    port: '8888', 
  }], 
  devices: [
      {
        hostName: 'exampleHost',
        type: 'EXAMPLE_TYPE', 
        name: 'DEVICE_1', 
      },
      {
        hostName: 'exampleHost',
        type: 'EXAMPLE_TYPE',
        name: 'DEVICE_2', 
      },
  ],
}

const iotes = createIotes({
  topology, 
  strategy: mqttStrategy
}) 

iotes.deviceSubscribe(state => console.log(state))
iotes.hostSubscribe(state => console.log(state))

iotes.deviceDispatch({
  'DEVICE_1':{  
    payload:{
      message: 'new information'
    }
  }
})
```

## Should You Use Iotes?

Iotes is currently in alpha and not suitable for use in production, however we are looking for feedback or contributions.

If you're looking for a quick and easy way to hook up a test application to one of the provided connection strategies then Iotes should be able to make your life easier.
