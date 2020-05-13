import React, { useState, useEffect, useRef } from 'react'
import { Collective, Graph } from '../components' 
import { createIotes, TopologyMap, Iotes, createDeviceDispatchable} from '@iotes/core'
import { mqttStrategy } from '@iotes/strategy-mqtt'

const topology: TopologyMap<{}, any> = {
  hosts: [{
    name: 'testapp/0',
    host: 'ws://test.mosquitto.org', 
    port: '8080' 
  }],
  client: {
    name: 'example'
  },
  devices: [
    {
      hostName: 'testapp/0',
      type: 'APP_CHANNEL',
      name: 'READER/1',
      channel: 1,
    },
    {
      hostName: 'testapp/0',
      type: 'EXTERNAL_CHANNEL',
      name: 'ENCODER/1',
      channel: 2,
    },
  ],
}

export const Example = () => {
  const [data, setData] = useState<any[]>([
    { x: 0, y: 0, yv: 0, xv: 0, '@@timestamp': Date.now() }
  ]) 
  
  const [hostStatus, setHostStatus] = useState<any>({})  

  const iotes = useRef<Iotes>(null)
  const isDeviceSubscribed = useRef<boolean>(false)
  const isHostSubscribed = useRef<boolean>(false)

  useEffect(() => {
    try{
      iotes.current = createIotes({
        topology, 
        strategy: mqttStrategy
      })
    } catch {
      return
    }
  }, [])


  useEffect(() => {
    if(!isDeviceSubscribed.current){
      iotes.current?.deviceSubscribe((state) => {
        setData([
          ...data, 
          state['ENCODER/1'].payload
        ].slice(-100))
      }, ['ENCODER/1'])
    }
  }, [iotes.current, data, isDeviceSubscribed.current])


  useEffect(() => {
    if(!isHostSubscribed.current){
      iotes.current?.hostSubscribe((state) => {
        setHostStatus(state['testapp/0'])
      })
    }
  }, [iotes.current, hostStatus, isHostSubscribed.current])

  return (
      <>
        <div >
          <h4 style={{margin: 0, padding: 0}}> Host: <span className={'primaryText'}>{hostStatus.type || ''}</span></h4>
          <code style={{ fontSize: '0.7em'}}>{JSON.stringify({name: hostStatus.name, type: hostStatus.type })}</code>
        </div>
        <div>
          <h4> Device: </h4>
        </div>
        <div
        className={'example'}
        style={{  
          justifyContent: 'space-between',
          alignItems: 'center',
          position:'relative',
        }} >
            <div className={'exampleElement'} style={{zIndex: 1, margin: '0 2em 0 0'}} >
              <Collective dataFramePeriod={150} onDataFrame={(d) => {
                const scaledData = {
                  ...d,
                  x: (d.x * 100),
                  y: (d.y * 100),
                  xv: (d.xv / 10),
                  yv: (d.yv / 10)
                }
                if(iotes.current){
                  iotes.current.deviceDispatch(createDeviceDispatchable('ENCODER/1', 'MQTT', scaledData))
                }
              }}/>
          </div>
          <div className={'exampleElement'} style={{zIndex: 1, position: 'relative'}} >
            <Graph data={data} />
          </div>
        </div>
        <div style={{width: '100%', textOverflow: 'ellipsis', position: 'relative', top:'2em'}}>
          <code style={{ fontSize: '0.7em'}}>{
            JSON.stringify(function(){
              const d = data.slice(-1)[0]
              return {
                x: Math.round(d.x * 100)/100,
                y: Math.round(d.x * 100)/100
              }
            }())
          }
          </code>
        </div>

      </>
  )
}
export default Example;