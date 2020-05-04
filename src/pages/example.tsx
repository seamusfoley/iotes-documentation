import React, { useState } from 'react'
import { Collective, Graph } from '../components' 
import { CollectiveData } from '../types'

export const Example = () => {
  const [data, setData] = useState<CollectiveData[]>([
    { x: 0, y: 0, yv: 0, xv: 0, '@@timestamp': Date.now() }
  ])  

  return (
      <div 
      className={'flexLayout'}
      style={{  
        justifyContent: 'space-between',
        alignItems: 'center',
        position:'relative',
      }} >
          <div style={{height:'100%', width: '100%', zIndex: 1}} >
          <Collective dataFramePeriod={100} onDataFrame={(d) => {
            const scaledData = {
              ...d,
              x: (d.x * 100),
              y: (d.y * 100),
              xv: (d.xv / 10),
              yv: (d.yv / 10)
            }

            setData([...data, scaledData].slice(-100))
          }}/>
        </div>
        <div style={{height:'100%', width: '100%', zIndex: 1, position: 'relative'}} >
          <Graph data={data} />
        </div>
    
      </div>
  )
}
export default Example;