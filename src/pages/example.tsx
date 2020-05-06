import React, { useState, useEffect, useRef } from 'react'
import { Collective, Graph } from '../components' 
import { createIotes, TopologyMap, Iotes, createDeviceDispatchable} from 'iotes'
import { mqttStrategy } from 'iotes-strategy-mqtt'
import * as buffer from 'buffer';

const topology: TopologyMap<{}, any> = {
  hosts: [{ name: 'testapp/0', host: 'ws://test.mosquitto.org', port: '8080' }],
  client: {name: 'example'},
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
  
  const [hostStatus, setHostStatus] = useState<string>('NOT CONNECTED')  

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
        setHostStatus(state['testapp/0'].type as string)
      })
    }
  }, [iotes.current, data, isHostSubscribed.current])

  useEffect(() => {
    // console.log(data)
  }, [data])


  return (
      <>
        <h4 style={{display: 'inline-block'}}>Host: <span style={{color: 'yellow'}}>{hostStatus}</span></h4>
        <h4> Device: </h4>
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
        <div style={{marginTop: '30px'}}>
          <code style={{ fontSize: '0.7em', whiteSpace: 'nowrap'}}>{
            JSON.stringify(function(){
              const {xv, yv, ...rest} = data.slice(-1)[0]
              return rest
            }())
          }
          </code>
        </div>

      </>
  )
}
export default Example;