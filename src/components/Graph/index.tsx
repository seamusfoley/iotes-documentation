
import React, { useRef, useState, useEffect } from 'react'
import { LinePath, Line, Bar } from '@vx/shape'
import { curveMonotoneX } from '@vx/curve'
import { GridRows } from '@vx/grid'
import { scaleTime, scaleLinear } from '@vx/scale'
import { Tooltip, TooltipWithBounds } from '@vx/tooltip'
import { localPoint } from '@vx/event'
import { bisector } from 'd3-array'
import { timeFormat } from 'd3-time-format'
import { AxisLeft } from '@vx/axis'
import  { CollectiveData } from '../../types'
import { useEventListener } from '../../utils'

// util
const formatDate = timeFormat("%H:%M:%S  %L");
const min = (arr: CollectiveData[], fn: (x: any) => number) => Math.min(...arr.map(fn))
const max = (arr: CollectiveData[], fn: (x: any) => number) => Math.max(...arr.map(fn))
const extent = (arr: CollectiveData[], fn: (x: any) => number) => [min(arr, fn), max(arr, fn)]

type Props = {
  data: CollectiveData[]
  margin?: {left: number, right: number, top: number, bottom: number }
}

const Area: React.FC<Props> = (props) => {
  const {
    data
  } = props;

  if(typeof window === undefined) return <></>

  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

  const lpx = useRef<number>(0)
  const ref = useRef<SVGSVGElement>(null)
  const tooltipRef = useRef<SVGLineElement>(null)
  
  const margin = { left: 0, right: 0, top: 0, bottom: 0 }

  const handleResize = () => {
    setWidth(ref.current?.parentElement.getBoundingClientRect().width || 0)
    setHeight(ref.current?.parentElement.getBoundingClientRect().height || 0)
  }

  useEffect(() => {
    handleResize()
  }, [ref.current?.parentElement])

  useEventListener('resize', handleResize)

  const [tooltip, setTooltip] = useState({
    isVisible: false,
    data: data[0],
    left: 0,
    topX: 0,
    topY: 0
  })

  const xMax = width - margin.left - margin.right
  const yMax = height - margin.top - margin.bottom

  // accessors
  const xValue = (d: CollectiveData): Date => new Date(d['@@timestamp']);
  const yValue = (d: CollectiveData): number => d.y;
  const bisectDate = bisector((d: CollectiveData) => new Date(d['@@timestamp'])).left;

  // scales
  const xScale = scaleTime({
      range: [0, xMax],
      domain: extent(data, (d: CollectiveData) => Number(xValue(d)))
    })

  const yScale = scaleLinear({
    range: [yMax, 0],
    domain: [-100, 100],
    nice: true
  });

  const handleTooltip = (x: number)  => {
    const bounds = ref.current?.getBoundingClientRect()
    const x0 = xScale.invert((bounds!.width) - (bounds!.width * 0.0))
    const index = bisectDate(data, x0, 1)
    const d0 = data[index - 1]
    const d1 = data[index]


    let d = d0
    if (d1 && d1['@@timestamp']) {
      d = Number(x0) - Number(xValue(d0)) > Number(xValue(d1)) - Number(x0) ? d1 : d0
    }

    setTooltip({
      isVisible: true,
      data: d,
      left: xMax,
      topY: yScale(d.y),
      topX: yScale(d.x)
    });
  }

  useEffect(() => {
    handleTooltip(lpx.current)
  }, [data])

  return (
    <>
        <svg ref={ref} width={'100%'} height={'100%'} overflow={'visible'} style={{position: 'relative'}}>
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#E4B800" stopOpacity={1} />
              <stop offset="100%" stopColor="#E4B800" stopOpacity={0.6} />
            </linearGradient>
          </defs>
          <AxisLeft
            axisLineClassName={'graph'}
            tickClassName={'graph'}
            labelClassName={'graph'}
            scale={yScale}
            numTicks={10}
            labelProps={{
              fill: '#E4B800',
              textAnchor: 'middle',
              fontSize: 12,
              fontFamily: 'Arial'
            }}
            tickLabelProps={(value, index) => ({
              textAnchor: 'end',
              fontSize: 10,
              fontFamily: 'Arial',
              dx: '-0.25em',
              dy: '0.25em'
            })}
          />
          <GridRows
            className={'graph'}
            lineStyle={{ pointerEvents: 'none' }}
            scale={yScale}
            width={xMax}
            strokeWidth={1}
            strokeDasharray="2,2"
          />

           <LinePath
            data={data}
            x={d => xScale(xValue(d))}
            y={d => yScale(d.yv)}
            strokeWidth={1}
            strokeOpacity={0.3}
            stroke={'green'}
            curve={curveMonotoneX}
          />
           <LinePath
            data={data}
            x={d => xScale(xValue(d))}
            y={d => yScale(d.xv)}
            strokeWidth={1}
            strokeOpacity={0.3}
            stroke={'pink'}
            curve={curveMonotoneX}
          />
          <LinePath
            data={data}
            x={d => xScale(xValue(d))}
            y={d => yScale(d.y)}
            strokeWidth={1}
            stroke={'#C7007A'}
            curve={curveMonotoneX}
          />
          <LinePath
            data={data}
            x={d => xScale(xValue(d))}
            y={d => yScale(d.x)}
            strokeWidth={1}
            stroke={'#E4B800'}
            curve={curveMonotoneX}
          />
          <Bar
            x={0}
            y={0}
            width={width}
            height={height}
            fill="transparent"
            rx={14}
            onTouchStart={event =>
              lpx.current = localPoint(event)!.x
            }
            onTouchMove={event => {
              lpx.current = localPoint(event)!.x
            }}
            onMouseMove={event => {
              lpx.current = localPoint(event)!.x
              handleTooltip(lpx.current)
            }}
            onMouseLeave={_ => setTooltip({
              ...tooltip,
            })}
          />
          {tooltip.isVisible && (
            <g ref={tooltipRef}>
              <Line
                className={'graph'}
                from={{ x: tooltip.left, y: 0 }}
                to={{ x: tooltip.left, y: yMax }}
                strokeWidth={1}
                style={{ pointerEvents: 'none' }}
                strokeDasharray="2,2"
              />
              <circle
                cx={tooltip.left}
                cy={tooltip.topY + 1}
                r={4}
                fill="black"
                fillOpacity={0.0}
                stroke="black"
                strokeOpacity={0.1}
                strokeWidth={2}
                style={{ pointerEvents: 'none' }}
              />
              <circle
                cx={tooltip.left}
                cy={tooltip.topY}
                r={6}
                fill="black"
                fillOpacity={0.0}
                stroke="#C7007A"
                strokeWidth={2}
                strokeOpacity={1}
                style={{ pointerEvents: 'none' }}
              />
              <circle
                cx={tooltip.left}
                cy={tooltip.topX}
                r={8}
                fill="black"
                fillOpacity={0.0}
                stroke="#E4B800"
                strokeWidth={2}
                strokeOpacity={1}
                style={{ pointerEvents: 'none' }}
              />
            </g>
          )}
        </svg>
        {tooltip.isVisible && (
          <>
            <Tooltip
              top={0}
              left={width - 75}
              style={{
                backgroundColor: '#C7007A',
                color: 'black',
                whiteSpace: 'nowrap',
              }}
            >
              {`y: ${Math.round(tooltip.data.y)}`}
            </Tooltip>
            <Tooltip
              top={40}
              left={width - 75}
              style={{
                backgroundColor: '#E4B800',
                color: 'black',
                whiteSpace: 'nowrap',
              }}
            >
              {`x: ${Math.round(tooltip.data.x)}`}
            </Tooltip>
            <Tooltip
              top={height}
              left={ width - 0 }
              style={{
                backgroundColor: 'black',
                color: 'white',
                whiteSpace: 'nowrap',
                transform: 'translateX(-100%)'
              }}
            >
              {formatDate(xValue(tooltip.data))}
            </Tooltip>
          </>
        )}
      </>
  )
}

export const Graph = Area
