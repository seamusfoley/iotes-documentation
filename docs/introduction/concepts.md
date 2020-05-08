---
id: core-concepts
title: Core Concepts
---

## Iotes

The ```createIotes``` method takes two arguements, a topology map and a strategy

The topology map tells the strategy how to connect.
The strategy handles all the asyncronous connection details for the protocol (including auto reconnection if required, the device creation and device set up.

## Iotes Core

An iotes instance made by ```createIotes``` exposes four methods.

```javascript
hostSubscribe()
hostDispatch()

deviceSubscribe()
deviceDispatch()
```

Subscribe methods subscribe to the event streams from the device or the host.

Dispatch methods send messages to the device or the host.

This library has been inspried heavily by [redux](redux.js.org) (in fact an early iteration of iotes was written as a redux middleware), hence the use of ```subscribe``` and ```dispatch``` as opposed to pub/sub send/receive etc.

## Topology Map

The topology map is an object used to declare the desired state of connectivity. You can connect to multiple hosts and multiple devices to those hosts. The topology map is passed to the strategy which handles the set up of the devices. At the moment it is only possible to declare the topology at Iotes creation but maybe possible to declare updates to topology in the future. 

The topology map has a client object and and a hosts, and devices 'collection' (array of objects)

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
```

More information is avaliable on how to set up your topology map in the (api reference)['/api/topology.md]

## Dispatchables

A 'dispatchable' is the object that dispatch methods take to send to the devices. At minimum they must have the form

```javascript
{ 
  DEVICE_NAME: { 
    // Any body information
  }
}
```

The iotes package exports two helper methods 

```javascript
 createDeviceDispatchable()
 createHostDispatchable()
```

The methods are optional and create a suggested form for the dispatchables for the host and the device, though you may find these contain too much information depending on the frequency of your data 

## Strategies

Strategies set up the connections to the protocol your device is using. They handle all the asyncronous connections information and dispatch events through iotes core back to your application. 

You can use an existing strategies or write your own for more tailored handling of device connection. Modifying an existing strategy is a good way to to provide tighter specification for the types of device that can be connected and how they should behave.

You can see avaliable strategies in the sidebar

More information on writing your own strategy is avaliable [here](/docs/advanced/strategies)

## Plugins

Plugins are wrappers around iotes core which provide binding for the ```dispatch``` and the ```subscribe``` methods to be native form for a specific state management library. For example the react-hooks strategy provide access to a ```useIotesDevice``` and ```useIotesHost``` so you can use iotes connections directly in functional components.

Plugins are not injected as dependencies as strategies are, but are used instead of the iotes package. For example 

```javascript
import { createIotesReactHook } from 'iotes-plugins-react-hooks'
```

You can see avliable strategies in the sidebar

More information on writing your own plugin is avaliable [here](/docs/advanced/strategies)
