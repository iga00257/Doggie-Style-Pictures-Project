import { useState } from 'react'
import VirtualImageGrid from '@/components/common/VirtualImageGrid'
import Carousel from '@/components/common/Carousell'
import { useRouter } from 'next/router'
import Link from 'next/link'

interface BreedImagesProps {
  imagesFromServer: string[]
}

export default function Home({ imagesFromServer: images }: BreedImagesProps) {
  const [showCarousel, setShowCarousel] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const router = useRouter()
  const selectedBreed = router.query.id as string

  // 如果頁面正在切換中，顯示 loading
  if (router.isFallback) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-pulse text-neutral-600'>載入中...</div>
      </div>
    )
  }

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index)
    setShowCarousel(true)
  }

  const handleCloseCarousel = () => {
    setShowCarousel(false)
  }

  const handlePreviousImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }
  const { keyword } = router.query

  return (
    <main className='min-h-screen'>
      {selectedBreed && (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
          <div className='flex items-center mb-6 '>
            <Link
              href={`/${keyword ? `?keyword=${keyword}` : ''}`}
              className=' text-neutral-600 hover:text-neutral-900 
                         hover:bg-neutral-100 rounded-full transition-colors flex-shrink-0'
              prefetch={true}
              aria-label='返回品種列表'
            >
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
              </svg>
            </Link>
            <h1 className='flex-1 text-xl font-semibold capitalize text-primary truncate text-center'>{selectedBreed}</h1>
            <div className='w-5' /> {/* 平衡左側按鈕的空間 */}
          </div>
          <VirtualImageGrid images={images} breedName={selectedBreed} onImageClick={handleImageClick} />
        </div>
      )}

      {showCarousel && (
        <Carousel
          images={images}
          breedName={selectedBreed || ''}
          currentIndex={currentImageIndex}
          onClose={handleCloseCarousel}
          onPrevious={handlePreviousImage}
          onNext={handleNextImage}
        />
      )}
    </main>
  )
}
