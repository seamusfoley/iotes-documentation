---
id: strategies
title: Creating Custom Strategies
sidebar_label: Creating Strategies
---

Strategies are called by the **integrator** in the Iotes core. The integrator uses the **topology map** to create the required connections based on the strategy. 

:::tip Template Repository
There is a template repository for making your own strategies [here](https://github.com/iotes/template-strategy)
It includes the examples here, but also scripts for compilation and CI/CD.
:::

## Description

The **integrator** passes the iotes instance into the strategy as an argument

The strategy returns a **Host Factory** to the **integrator**

The **Host Factory** is a function that sets up a connection to a host. The **Host Factory** factory returns a **Device Factory**. 

The **Device Factory** is an object which is acts a dictionary of device connection functions. It has the form of ```{ DEVICE_TYPE: deviceConnectionFunction }```

The Strategy type looks like this

## Type Definition

```typescript
type Strategy<StrategyConfig, DeviceTypes extends string> = (Iotes: Iotes) => HostFactory<StrategyConfig, DeviceTypes>

type HostFactory<StrategyConfig, DeviceTypes extends string> = (hostConfig: HostConfig<StrategyConfig>, clientConfig: ClientConfig) => Promise<DeviceFactory<DeviceTypes>>

type DeviceFactory<DeviceTypes extends string> = {
    [key in DeviceTypes]: (device: DeviceConfig<DeviceTypes>) => Promise<{
        type: DeviceTypes
        name: string
        channel?: number
    }>
}
```
## Simple Example

A simplified example strategy looks like this

```javascript
const strategy = (iotes) => {
  // Host Factory
  return async (hostConfig, clientConfig) => { 

    // Set up host connection

    // Return Device Factory
    return async () => {
      return ({
        'DEVICE_1' : async(deviceConfig) => {

          // Set up device connection
        
        }
      })
    } 
  } 
}
```

## Template Example

We strongly recommend writing strtegies in typescript. An example could looks like this:

```typescript
import {
  DeviceFactory,
  HostConfig,
  Strategy,
  ClientConfig,
  DeviceConfig,
} from '@iotes/core'
import { DeviceTypes, StrategyConfig } from './types'

export const xStrategy: Strategy<StrategyConfig, DeviceTypes> = ({
  hostDispatch,
  deviceDispatch,
  hostSubscribe,
  deviceSubscribe,
}) => async (
  hostConfig: HostConfig<StrategyConfig>,
  clientConfig: ClientConfig,
): Promise<DeviceFactory<DeviceTypes>> => {
  // HOST FACTORY
  // Do host set up here

  const deviceFactory = (): DeviceFactory<DeviceTypes> => {
    // DEVICE FACTORIES

    const createDevice = async (
      deviceConfig: DeviceConfig<'DEVICE_TYPE'>,
    ) => {
      // Do device set up here
      const deviceSetUp = () => {}

      deviceSetUp() // write functions here

      return deviceConfig
    }

    // Return dictionary of device factories
    return {
      DEVICE_TYPE: createDevice,
    }
  }

  return deviceFactory()
}

// Export types
export { DeviceTypes, StrategyConfig }
```

## Template Repository

There is a template repository for making your own strategies [here](https://github.com/iotes/template-strategy)
It includes the examples here, but also scripts for compilation and CI/CD.

We recommend cloning this repository to get started
