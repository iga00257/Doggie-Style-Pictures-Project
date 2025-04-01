# 狗狗品種圖庫 (Dog Breeds Gallery)

一個使用 Next.js 建立的狗狗品種圖片瀏覽網站，api 資料來源為 [Dog CEO API](https://dog.ceo/dog-api/)。

## 系統需求

- Node.js 版本請參考 `.nvmrc` 文件 (v20.15)
- npm 9.x 或更高版本

## 開始使用

```bash
# 安裝依賴
npm install

# 開發環境運行
npm run dev

# 建置專案
npm run build

# 生產環境運行
npm run start
```

## 主要功能

- 瀏覽所有狗狗品種列表
- 搜尋特定品種
- 查看每個品種的相關圖片
- 圖片輪播展示
- 虛擬滾動優化大量圖片載入

## 技術堆疊

- Next.js 15 with page router
- React 18
- TypeScript
- Tailwind CSS

## 技術實現與選擇

1. **自製虛擬列表**

   - 位於 `src/components/common/VirtualImageGrid.tsx`
   - 動態計算可見區域，只渲染必要的項目
   - 優化長列表性能，減少 DOM 節點數量

2. **路由優化**

   ```typescript
   // _app.tsx 中的router事件監聽
   useEffect(() => {
     const handleStart = () => setIsLoading(true)
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
   ```

3. **圖片優化**

   ```typescript
   // 使用 Next.js Image 組件
   <Image src={imageUrl} alt={breed} width={500} height={500} placeholder='blur' blurDataURL={blurDataUrl} onLoadingComplete={handleImageBlur} />
   ```

   - 自動圖片優化
   - 延遲加載
   - 模糊 placeholder 提升使用者體驗

4. **選擇使用 getServerSideProps 在 server 端獲取資料**
   - 考慮到網路限制和效能優化：
     - Server 端獲取資料可減少客戶端的網路請求次數
     - 避免客戶端在低速網路環境下的多次 API 調用
     - 減少首次內容渲染時間（TTFB）
   - 使用 getServerSideProps 的效能優勢：
     - Server 端直接獲取數據，減少客戶端到 API 服務器的往返時間
     - 資料與 HTML 一起返回，避免客戶端二次請求
     - 在慢速網路環境下提供更好的使用者體驗
   - 相比 Client Side Fetching 的優勢：
     - 避免客戶端出現載入狀態閃爍
     - 減少瀏覽器的網路請求負擔
     - 更好的 SEO 分數
   - 特別適合本專案的場景：
     - 大量圖片資源的預處理
     - 網路環境限制下的效能優化
     - 確保首次載入的順暢體驗
   - 為何不使用 getStaticProps
     - getStaticProps 在 build time 時就會確定內容：
       - 如果在 build time 就隨機選擇 50 張圖片，所有用戶看到的都是相同的圖片
       - 即使設置 revalidate，在重新驗證前依然是相同的內容
     - getServerSideProps 可以：
       - 每次請求時重新隨機選擇圖片
       - 確保不同用戶或不同時間訪問能看到不同的圖片組合

## 未來改進計畫

1. **效能優化**

   - [ ] carousell dom 加上虛擬列表限制 DOM 數量，增進效能

2. **使用者體驗&功能**

   - [ ] 添加無限滾動&分頁功能在品種列表與圖片列表中(使用 interaction Observer)

3. **技術升級**
   - [ ] 遷移到 Next.js App Router
   - [ ] 實作 Suspense 優化載入體驗
   - [ ] 加入單元測試和效能測試

## License

MIT
