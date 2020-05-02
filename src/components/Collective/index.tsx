
import  React, {useState, useRef, useEffect} from 'react'
import { CollectiveData } from '../../types'

type Props = {
  onDataFrame?: (data: CollectiveData) => void
  dataFramePeriod?: number
}

type UseEventListener = <E>(
  eventName: string, 
  handler: (event: E) => void, 
  element?: HTMLElement | SVGElement | globalThis.Window | globalThis.Document
) => void

const useEventListener: UseEventListener = (
    eventName,
    handler,
    element = window
) => { 
  const savedHandler = useRef<(event: any) => void>();

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(
    () => {
      const isSupported = element && element.addEventListener;
      if (!isSupported) return;
  
      const eventListener = (event: Event) => savedHandler.current!(event);
      
      element.addEventListener(eventName, eventListener);

      return () => {
        element.removeEventListener(eventName, eventListener);
      };
    },
    [eventName, element]
  )
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
  const [isEditing, setIsEditing] = useState(false)
  const [updateReady, setUpdateReady] = useState(0)

  const collectiveSim = useRef<Omit<CollectiveData, '@@timestamp'>>({x:0, y:0, xv:0, yv:0})
  const userForce = useRef({x:0, y:0})

  const ref = useRef<SVGSVGElement>(null)
  const animRequest = useRef<number>(0)

  const handleCollectiveMove = (event: React.MouseEvent | React.TouchEvent) => {
    if (!isEditing) {
      userForce.current = {
        x: 0, 
        y: 0, 
      }
      return
    }

    let pointer = [0,0]
    if('touches' in event) {
      pointer = [event.touches[0].clientX, event.touches[0].clientY]
    } else {
      pointer = [event.clientX, event.clientY]
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
   
    animRequest.current = requestAnimationFrame((nextTime) => animation(nextTime, time));
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
    setIsEditing(false)
    userForce.current = {x:0, y:0}
  }

  useEventListener('mousemove', handleCollectiveMove)

  useEffect(() => {
    onDataFrame({
      '@@timestamp': Date.now(), 
      ...collectiveSim.current,
      x: collectiveSim.current.x / pos.r || 0,
      y: collectiveSim.current.y / pos.r || 0
   })

    setTimeout(() => setUpdateReady(Date.now()), dataFramePeriod)
  }, [ updateReady ])

  useEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
    window.addEventListener('mouseup', handleFinishEditing);
    window.addEventListener('touchend', handleFinishEditing);

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    animRequest.current = requestAnimationFrame(animation);
    return () => cancelAnimationFrame(animRequest.current);
  }, [])

  return (
      <svg height={'100%'} width={'100%'} ref={ref} overflow={'visible'}>
          <defs>
            <radialGradient id="shadow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" style={{stopColor: '#333', stopOpacity:0 }} />
              <stop offset="100%" style={{stopColor: '#272727', stopOpacity:1 }} />
            </radialGradient>
        </defs>
        <circle 
          cx={pos.cx} 
          cy={pos.cy} 
          r={pos.r} 
          fillOpacity={0}
        />
        <circle 
          cx={pos.cx} 
          cy={pos.cy} 
          r={Math.abs(pos.r - 2)} 
          strokeWidth={4}
          stroke='#999'
          strokeOpacity={1.0}
          fillOpacity={0}
        />
        {isEditing ? <circle 
          cx={pos.cx + (collective.x * 2.5)} 
          cy={pos.cy + (collective.y * 2.5)} 
          r={64} 
          stroke='#E4B800' 
          strokeWidth={2}
          strokeOpacity={0.66}
          fillOpacity={0}
          onMouseDown={(event) => { 
            event.preventDefault()
            setIsEditing(true) }}
          onTouchStart={(event) => { 
            event.preventDefault()
            setIsEditing(true) 
          }}
        /> : null}
        <circle 
          cx={pos.cx + collective.x} 
          cy={pos.cy + collective.y} 
          r={10} 
          stroke='#E4B800' 
          strokeWidth={2}
          fillOpacity={0.2}
          fill='#E4B800'
          onMouseDown={() => { setIsEditing(true) }}
          onTouchStart={() => { setIsEditing(true) }}
          />
      </ svg>
  )
}