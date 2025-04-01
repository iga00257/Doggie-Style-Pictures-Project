import BreedItemIcon from './BreedItemIcon'

interface Breed {
  name: string
  subBreeds: string[]
}

interface BreedListProps {
  breeds: Array<Breed>
  onBreedSelect: (breedName: string) => void
  searchTerm?: string
}

export default function BreedList({ breeds, onBreedSelect, searchTerm }: BreedListProps) {
  return (
    <div className='space-y-4'>
      {searchTerm && (
        <div className='flex items-center justify-between px-2 py-3 rounded-lg bg-[#FFFFFF]'>
          <div className='text-sm text-neutral-600'>
            <span className='font-medium'>「{searchTerm}」</span>的搜尋結果：
            <span className='ml-2 font-medium'>{breeds.length}</span> 個品種
          </div>
        </div>
      )}

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {breeds.map((breed) => (
          <button
            key={breed.name}
            onClick={() => onBreedSelect(breed.name)}
            className='group p-4  border border-neutral-200 rounded-lg 
                       hover:border-primary-500/30 hover:shadow-lg hover:-translate-y-2
                       transition-all duration-300 text-left cursor-pointer bg-[#FDFDFC] shadow-sm'
          >
            <div
              className='text-lg font-semibold capitalize text-primary 
                           group-hover:text-primary-600 transition-colors flex items-center'
            >
              <div className='mr-2'>
                <BreedItemIcon />
              </div>
              <span
                className='text-lg font-semibold capitalize text-primary 
                           group-hover:text-primary-600 transition-colors'
              >
                {breed.name}
              </span>
            </div>
            <div className='mt-1.5 flex items-center text-secondary text-sm'>
              <svg className='w-4 h-4 mr-1.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 7l5 5m0 0l-5 5m5-5H6' />
              </svg>
              查看圖片
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
