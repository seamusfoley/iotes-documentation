import React, { useState } from 'react';
import { Collective, Graph } from '../components' 
import { CollectiveData } from '../types'
import Layout from '@theme/Layout'

export const Example = () => {
  const [data, setData] = useState<CollectiveData[]>([
    { x: 0, y: 0, yv: 0, xv: 0, '@@timestamp': Date.now() }
  ])  

  return (
      <div style={{ 
        display: 'flex', 
        width: '100%',
        height: '400px',
        flexDirection: 'row', 
        justifyContent: 'space-between',
        alignItems: 'center'
      }} >
          <div style={{height:'100%', width:'30%', margin: '0 50px 0 0', zIndex: 1}} >
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
        <div style={{height:'100%', width:'70%', zIndex: 1}} >
          <Graph data={data} />
        </div>
    
      </div>
  )
}
export default Example;