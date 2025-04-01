import type { AppProps } from 'next/app'
import { useState } from 'react'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import '@/styles/globals.css'
import Head from 'next/head'
export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const handleStart = () => {
      setIsLoading(true)
    }

    // 路由變化完成時
    const handleComplete = () => setIsLoading(false)

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleComplete)
    router.events.on('routeChangeError', handleComplete)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleComplete)
      router.events.off('routeChangeError', handleComplete)
    }
  }, [router])
  return (
    <>
      <Head>
        <link rel='icon' type='image/x-icon' href='/favicon.ico' />
        <link rel='shortcut icon' href='/favicon.ico' />
      </Head>
      <div className='min-h-screen bg-gradient-to-br from-[#E7F1E8] from-10% via-[#D1E4DA] via-50% to-[#B6D7C9] to-90% bg-fixed'>
        {isLoading ? (
          <div className='min-h-screen flex items-center justify-center'>
            <div className='animate-pulse text-neutral-600'>載入中...</div>
          </div>
        ) : (
          <Component {...pageProps} />
        )}
      </div>
    </>
  )
}
