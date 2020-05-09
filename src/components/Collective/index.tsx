
import  React, {useState, useRef, useEffect} from 'react'
import { CollectiveData } from '../../types'
import { useEventListener } from '../../utils'
import classnames from 'classnames'

type Props = {
  onDataFrame?: (data: CollectiveData) => void
  dataFramePeriod?: number
}

type Point = {
  x: number,
  y: number
}

const getDistanceFromCentre = (point: Point): number => Math.sqrt(Math.abs(Math.pow(point.x,2)) + Math.abs(Math.pow(point.y,2)))

export const Collective: React.FC<Props> = (props) => {
  const {
    onDataFrame = (data: CollectiveData) => {},
    dataFramePeriod = 250
  } = props

  const [pos, setPos] = useState({r: 1, cx: 1, cy:1})
  const [bounding, setBounding] = useState({left: 0, top:0})
  const [collective, setCollective] = useState({x:0, y:0})
  const isEditing = useRef(false)
  const [updateReady, setUpdateReady] = useState(0)

  const showHint  = useRef<boolean>(true)
  const collectiveSim = useRef<Omit<CollectiveData, '@@timestamp'>>({x:0, y:0, xv:0, yv:0})
  const userForce = useRef({x:0, y:0})

  const ref = useRef<SVGSVGElement>(null)
  const animRequest = useRef<number>(0)

  const handleCollectiveMove = (event: React.MouseEvent | React.TouchEvent) => {
    if (!isEditing.current) {
      userForce.current = {
        x: 0, 
        y: 0, 
      }
      return
    }

    event.preventDefault()
    document.body.classList.add('noselect')

    let pointer = [0,0]
    if('touches' in event) {
      pointer = [event.touches[0].pageX, event.touches[0].pageY]
    } else {
      pointer = [event.pageX, event.pageY]
    }

    const collectiveValue = {
      x: pointer[0] - (bounding.left + pos.cx),
      y: pointer[1] - (bounding.top + pos.cy)
    }

    const c2col = getDistanceFromCentre(collectiveValue)

    const angleToPointer = Math.abs(Math.atan(collectiveValue.y / collectiveValue.x))

    const h = c2col < (pos.r*2) ? c2col : (pos.r*2)
    const a = h * Math.cos(angleToPointer)
    const o = h * Math.sin(angleToPointer)

    userForce.current = {
      x: collectiveValue.x < 0 ? a * -1 : a, 
      y: collectiveValue.y < 0 ? o * -1 : o,  
    }
  }

  const springStep = (
    deltaTime: number, 
    prevPos: number, 
    prevVel: number,
    userForce: number
  ): {pos: number, vel: number} => {
    const k = 1.0
    const mass = 0.1

    const a = (-k/(mass)) * prevPos

    const vel = ((prevVel * 0.97) + (deltaTime * a))

    const pos = prevPos + (deltaTime * (vel + userForce))

    return {
      pos: Math.round(pos * 1000)/1000,
      vel: Math.round(vel * 1000)/1000,
    }
  }

  const animation = (time: number, prevTime: number = 0) => {
    const deltaTime = (time - prevTime) / 1000

    const xSpring = springStep(deltaTime, collectiveSim.current.x, collectiveSim.current.xv, userForce.current.x || 0)
    const ySpring = springStep(deltaTime, collectiveSim.current.y, collectiveSim.current.yv, userForce.current.y || 0)

    collectiveSim.current = {
      x: xSpring.pos,
      xv: xSpring.vel,
      y: ySpring.pos,
      yv: ySpring.vel,
    }

    setCollective({
      x: collectiveSim.current.x,
      y: collectiveSim.current.y 
    })
   
    if (window !== undefined){
      animRequest.current = requestAnimationFrame((nextTime) => animation(nextTime, time));
    }
  }

  const handleResize = () => {
    const {
      left = 0,
      top = 0,
      width = 0,
      height = 0,
    } = ref.current?.getBoundingClientRect() as DOMRect

    const d = Math.min(width, height)
    const r = d/2

    setPos({
      r: r, 
      cx: width/2,
      cy: height/2,
    })

    setBounding({
      left,
      top
    })
  }

  const handleFinishEditing = () => {
    isEditing.current = false
    userForce.current = {x:0, y:0}
  }

  const handleMove = (e) => {
    if (isEditing.current) {
      e.preventDefault()
      document.body.classList.add('noselect')
    }
  }

  useEventListener('mousemove', handleCollectiveMove, undefined, {passive: false})
  useEventListener('touchmove', handleCollectiveMove, undefined, {passive: false})
  useEventListener('resize', handleResize)
  useEventListener('mouseup', handleFinishEditing)
  useEventListener('touchend', handleFinishEditing)

  useEffect(() => {
    onDataFrame({
      '@@timestamp': Date.now(), 
      ...collectiveSim.current,
      x: collectiveSim.current.x / pos.r || 0,
      y: (collectiveSim.current.y / pos.r) * -1 || 0
   })

    const timeout = setTimeout(() => setUpdateReady(Date.now()), dataFramePeriod)

    return () => { clearTimeout(timeout) }
  }, [ updateReady ])

  useEffect(() => {
    handleResize()
  }, [ref.current])

  useEffect(() => {
    if (window !== undefined ){
      animRequest.current = requestAnimationFrame(animation);
      return () => cancelAnimationFrame(animRequest.current);
    }
  }, [])

  return (
      <svg height={'100%'} width={'100%'} ref={ref} overflow={'visible'}>
          <defs>
            <radialGradient id="shadow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" style={{stopColor: '#333', stopOpacity:0 }} />
              <stop offset="100%" style={{stopColor: '#272727', stopOpacity:1 }} />
            </radialGradient>
        </defs>
        <line
          className={'collective'}
          x1={pos.cx + pos.r} 
          y1={'50%'} 
          x2={pos.cx - pos.r}
          y2={'50%'} 
          fillOpacity={0}
        />
        <line
          className={classnames('collective', 'y')}
          x1={'50%'} 
          y1={pos.cy + pos.r} 
          x2={'50%'} 
          y2={pos.cy - pos.r}
          fillOpacity={0}
        />
        <circle 
          cx={pos.cx} 
          cy={pos.cy} 
          r={pos.r} 
          fillOpacity={0}
        />
        <circle 
          className={'collective'}
          cx={pos.cx} 
          cy={pos.cy} 
          r={Math.abs(pos.r - 2)} 
          strokeWidth={1}
          strokeOpacity={1.0}
          fillOpacity={0}
          onTouchStart={(event) => { 
            showHint.current = false
            isEditing.current = true
          }}
        />
        {isEditing.current ? <circle 
          cx={pos.cx + (collective.x * 2.5)} 
          cy={pos.cy + (collective.y * 2.5)} 
          r={64} 
          stroke='#CCC' 
          strokeWidth={2}
          strokeOpacity={0.66}
          fillOpacity={0}
        /> : null}
        <circle
          style={{cursor: 'pointer'}}
          cx={pos.cx + collective.x} 
          cy={pos.cy + collective.y} 
          r={10} 
          stroke='#CCC' 
          strokeWidth={2}
          fillOpacity={0.2}
          fill='#CCC' 
          onMouseDown={() => { 
            showHint.current = false
            isEditing.current = true  
          }}
          onTouchStart={(event) => { 
            showHint.current = false
            isEditing.current = true
          }}
          />
          { showHint.current ? <text 
            x={ pos.cx + collective.x - 30 } 
            y={ pos.cy + collective.y + 40 }
            fill={'#ccc'}
          > 
            Drag Me!
          </text> : null }
      </ svg>
  )
}