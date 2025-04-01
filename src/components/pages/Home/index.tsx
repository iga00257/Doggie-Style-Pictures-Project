import { useState } from 'react'
import SearchBar from '@/components/common/SearchBar'
import BreedList from '@/components/common/BreedList'
import ShibaIcon from '@/components/common/ShibaIcon'
import { useRouter } from 'next/router'

interface Breed {
  name: string
  subBreeds: string[]
}

interface HomeProps {
  breeds: Breed[]
}

export default function Home({ breeds }: HomeProps) {
  const router = useRouter()
  const { keyword } = router.query

  const [searchTerm, setSearchTerm] = useState((keyword as string) || '')
  const [showDropdown, setShowDropdown] = useState(false)

  const handleBreedSelect = (breed: string) => {
    handleCloseDropdown()
    const queryParams = new URLSearchParams()
    if (searchTerm) {
      queryParams.set('keyword', searchTerm)
    }
    router.push(`${breed}/images?${queryParams.toString()}`)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setShowDropdown(true)
  }

  const handleSearchClear = () => {
    setSearchTerm('')
    handleCloseDropdown()
  }

  const handleCloseDropdown = () => {
    setShowDropdown(false)
  }

  const lowerCaseSearchTerm = searchTerm.toLowerCase()
  const filteredBreeds = breeds
    .filter((breed) => breed.name.toLowerCase().includes(lowerCaseSearchTerm))
    .sort((a, b) => {
      if (a.name.startsWith(lowerCaseSearchTerm) && !b.name.startsWith(lowerCaseSearchTerm)) return -1
      if (!a.name.startsWith(lowerCaseSearchTerm) && b.name.startsWith(lowerCaseSearchTerm)) return 1
      return a.name.localeCompare(b.name)
    })
  return (
    <main className='min-h-screen '>
      <header className=' shadow-sm bg-[#B2CCC5] text-white p-4 text-2xl font-bold tracking-wide '>
        <div className='container py-4 px-4 flex items-center'>
          <h1 className='text-xl font-semibold text-text-primary mr-2'>可愛狗狗圖庫</h1>
          <ShibaIcon />
        </div>
      </header>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          onSearchClear={handleSearchClear}
          showDropdown={showDropdown}
          filteredBreeds={filteredBreeds}
          onBreedSelect={handleBreedSelect}
          handleCloseDropdown={handleCloseDropdown}
        />
        <BreedList breeds={filteredBreeds} onBreedSelect={handleBreedSelect} searchTerm={searchTerm} />
      </div>
    </main>
  )
}
