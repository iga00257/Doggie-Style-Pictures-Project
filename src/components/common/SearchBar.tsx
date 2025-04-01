import { useEffect, useRef } from 'react'

interface SearchBarProps {
  searchTerm: string
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSearchClear: () => void
  showDropdown: boolean
  filteredBreeds: Array<{ name: string; subBreeds: string[] }>
  onBreedSelect: (breedName: string) => void
  handleCloseDropdown: () => void
}

export default function SearchBar({
  searchTerm,
  onSearchChange,
  onSearchClear,
  showDropdown,
  filteredBreeds,
  onBreedSelect,
  handleCloseDropdown,
}: SearchBarProps) {
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 如果使用者點擊範圍在搜尋框外，則關閉下拉選單
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        handleCloseDropdown()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [handleCloseDropdown])

  return (
    <>
      {/* 遮罩層 */}
      {showDropdown && searchTerm && (
        <div className='fixed inset-0 bg-black/20 backdrop-blur-sm z-10 transition-opacity duration-300' onClick={handleCloseDropdown} />
      )}

      {/* 搜尋框和下拉選單 */}
      <div className='relative mb-4 z-20' ref={searchRef}>
        <div className='relative'>
          <div className='relative'>
            <input
              type='text'
              placeholder='搜尋狗狗品種...'
              className={`
                w-full pl-10 pr-10 py-2 border  rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                 hover:bg-neutral-100 focus:bg-white
                transition-colors duration-300
                bg-white border-border text-primary
              `}
              value={searchTerm}
              onChange={onSearchChange}
            />
            <div className='absolute left-3 top-1/2 -translate-y-1/2'>
              <svg className='h-5 w-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
              </svg>
            </div>
            {searchTerm && (
              <button
                onClick={onSearchClear}
                className='absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors'
                aria-label='清除搜尋'
              >
                <svg className='h-5 w-5 text-gray-500 hover:text-gray-700' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            )}
          </div>
        </div>
        {showDropdown && searchTerm && (
          <div className='absolute w-full mt-2 bg-white rounded-lg shadow-lg max-h-[60vh] overflow-y-auto'>
            <div className='bg-white rounded-lg w-full h-full'>
              {filteredBreeds.length > 0 ? (
                filteredBreeds.map((breed) => (
                  <button
                    key={breed.name}
                    onClick={() => onBreedSelect(breed.name)}
                    className='w-full px-4 py-2 text-left 
                      border border-transparent
                      hover:bg-gray-100 
                      hover:border-neutral-400
                      transition-all duration-300
                      first:rounded-t-lg last:rounded-b-lg'
                  >
                    <div className='font-medium capitalize'>{breed.name}</div>
                    {breed.subBreeds.length > 0 && <div className='text-sm text-gray-500'>子品種: {breed.subBreeds.length}</div>}
                  </button>
                ))
              ) : (
                <div className='px-4 py-6 text-center text-gray-500'>
                  <p>找不到符合「{searchTerm}」的品種</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
