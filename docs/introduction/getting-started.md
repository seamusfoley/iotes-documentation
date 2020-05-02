---
id: getting-started
title: Getting Started with Iotes
sidebar_label: Getting Started
---

Iotes is an iot adapter for JavaScript applications.

It helps you write applications that connect to iot services, using a number of protocols, in a predictable way that's consistent with declaritive application frameworks.

You can use iotes core alone, or use it with plugins that provide bindings to popular libraries 

## Installation

Iotes is available as a package on NPM for use with a module bundler or in a Node application:

### NPM

```
npm install iotes
```

### Yarn

```
yarn add iotes
```

For more information see the [installation](./installation) page

## Using iotes in your app

This is a basic example that uses the mqttStrategy to connect two devices to the moquitto public mqtt broker.

```javascript
import { createIotes } from 'iotes'
// This example uses mqtt through the mqtt strategy
import { mqttStategy } from 'iotes-strategy-mqtt' 

// Iotes uses a topology map to declare which devices should be connected
const topology = {
  client: { 
    // The name of your application using iotes
    name: 'appName' 
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

// Create an Iotes instance 

// This example connects to mqtt using the basic mqtt strategy
const iotes = createIotes(topology, mqttStrategy) 

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

## Should You Use Iotes?

Iotes is currently in alpha and not suitable for use in production, however we are looking for feedback or contributions.

If you're looking for a quick and easy way to hook up a test application to one of the provided connection strategies then iotes should be able to make your life easier.
