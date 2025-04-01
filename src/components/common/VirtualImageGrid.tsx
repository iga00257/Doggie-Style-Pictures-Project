import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import handleImageBlur from '@/methods/handleImageBlur'

interface VirtualImageGridProps {
  images: string[]
  breedName: string
  onImageClick: (index: number) => void
}

const OVERSCAN = 3 // 上下額外渲染的項目數
const MOBILE_GAP = 8 // 手機版間距
const DESKTOP_GAP = 16 // 桌面版間距

export default function VirtualImageGrid({ images, breedName, onImageClick }: VirtualImageGridProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 0 })
  const [columns, setColumns] = useState(3)
  const [gap, setGap] = useState(DESKTOP_GAP)
  const [itemHeight, setItemHeight] = useState(0)

  // 計算列數、間距和項目高度
  useEffect(() => {
    const updateLayout = () => {
      const width = window.innerWidth
      const containerWidth = containerRef.current?.clientWidth || width
      let newColumns: number
      let newGap: number

      if (width < 640) {
        newColumns = 3
        newGap = MOBILE_GAP
      } else if (width < 768) {
        newColumns = 4
        newGap = DESKTOP_GAP
      } else {
        newColumns = 5
        newGap = DESKTOP_GAP
      }

      // 計算單個項目的寬度（也就是高度）
      const totalGapsWidth = newGap * (newColumns - 1)
      const availableWidth = containerWidth - totalGapsWidth - newGap
      const newItemHeight = Math.floor(availableWidth / newColumns)

      setColumns(newColumns)
      setGap(newGap)
      setItemHeight(newItemHeight)
    }

    updateLayout()
    window.addEventListener('resize', updateLayout)
    return () => window.removeEventListener('resize', updateLayout)
  }, [])

  // 計算可見範圍
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const scrollTop = container.scrollTop
      const containerHeight = container.clientHeight

      const visibleRows = Math.ceil(containerHeight / (itemHeight + gap)) + 2 * OVERSCAN

      const startRow = Math.max(0, Math.floor(scrollTop / (itemHeight + gap)) - OVERSCAN)
      const endRow = Math.min(Math.ceil(images.length / columns) - 1, startRow + visibleRows)

      const startIndex = startRow * columns
      const endIndex = Math.min(images.length - 1, (endRow + 1) * columns - 1)

      setVisibleRange({
        start: Math.max(0, startIndex),
        end: Math.min(images.length - 1, endIndex),
      })
    }

    container.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => container.removeEventListener('scroll', handleScroll)
  }, [images.length, columns, gap, itemHeight]) // 添加 itemHeight 依賴

  // 計算總高度
  const totalRows = Math.ceil(images.length / columns)
  const totalHeight = totalRows * (itemHeight + gap) - gap

  // 計算項目的位置
  const getItemPosition = (index: number) => {
    const row = Math.floor(index / columns)
    const col = index % columns
    const top = row * (itemHeight + gap)
    const itemWidth = 100 / columns
    const left = col * itemWidth
    return { top, left, width: itemWidth }
  }

  // 計算是否在視窗內
  const isInViewport = (index: number) => {
    const container = containerRef.current
    if (!container) return false

    const { top } = getItemPosition(index)
    const containerHeight = container.clientHeight
    const scrollTop = container.scrollTop

    return top >= scrollTop - (itemHeight + gap) * OVERSCAN && top <= scrollTop + containerHeight + (itemHeight + gap) * OVERSCAN
  }

  return (
    <div
      ref={containerRef}
      className='h-[calc(100vh-100px)] overflow-auto scrollbar-hide'
      style={{
        position: 'relative',
        padding: `0 0 20px`,
      }}
    >
      <div
        style={{
          height: totalHeight,
          position: 'relative',
        }}
      >
        {images.slice(visibleRange.start, visibleRange.end + 1).map((image, index) => {
          const actualIndex = visibleRange.start + index
          // 只渲染在視窗內的項目
          if (!isInViewport(actualIndex)) return null

          const { top, left, width } = getItemPosition(actualIndex)
          return (
            <div
              key={image}
              className='absolute cursor-pointer '
              onClick={() => onImageClick(actualIndex)}
              style={{
                top: `${top}px`,
                left: `${left}%`,
                width: `calc(${width}% - ${gap}px)`,
                height: `${itemHeight}px`,
                margin: `0 ${gap / 2}px`,
              }}
            >
              <div className='relative w-full h-full bg-white rounded-md p-[6px]'>
                <div className='relative w-full h-full'>
                  <Image
                    src={image}
                    alt={`${breedName} dog ${actualIndex + 1}`}
                    fill
                    className='object-cover rounded-md'
                    sizes='(max-width: 640px) 33vw, (max-width: 768px) 25vw, 20vw'
                    placeholder='blur'
                    blurDataURL={handleImageBlur()}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
