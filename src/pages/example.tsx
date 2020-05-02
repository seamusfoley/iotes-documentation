import React, { useState } from 'react';
import { Collective, Graph } from '../components' 
import { CollectiveData } from '../types'
import Layout from '@theme/Layout'

const Example = () => {
  const [data, setData] = useState<CollectiveData[]>([
    { x: 0, y: 0, yv: 0, xv: 0, '@@timestamp': Date.now() }
  ])  

  return (
    <Layout title="Hello">
      <div style={{ 
        display: 'flex', 
        height: '100vh', 
        flexDirection: 'column', 
        justifyContent: 'center',
        alignItems: 'center'
      }} >
        <div  style={{width: '100%', height:'10%', zIndex: 2}} />
        <Graph width={700} height={400} data={data} />
        <div style={{height: '60%', width:'30%', margin: '2em 0', zIndex: 1}} >
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
        <div style={{width: '100%', height:'10%'}} />
      </div>
    </Layout>
  )
}
export default Example;