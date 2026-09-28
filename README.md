# 億鑫分會網站

Next.js 15 + Tailwind CSS 4，全站靜態產生，內容全部存成 `content/` 底下的 Markdown 檔，不需要資料庫。
推上 GitHub 之後，Vercel 會自動建置和部署。

## 本機預覽

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # 上線前先確認建置會過
```

## 內容放在哪裡

| 區塊 | 資料夾 | 一個檔案 = |
|---|---|---|
| 會員 | `content/members/` | 一位會員 |
| 案例 | `content/cases/` | 一則 Power Team 案例 |
| 教育 | `content/education/` | 一週的教育簡報 |
| 全站設定 | `content/site.json` | 分會名稱、例會時間地點、來賓預約連結、產業大分類、「分會即品牌」影像 |

檔名就是網址，例如 `content/members/wang-da-ming.md` 對應 `/members/wang-da-ming`。檔名請用英文小寫加連字號。
圖片放在 `public/images/`，檔案裡寫成 `/images/xxx.jpg`。欄位留空時，網站會自動顯示「圖片待置換」的佔位。

### 新增一位會員

複製 `content/members/sample-engineering-01.md`，改檔名和欄位即可。

- `industry` 必須是 `site.json` 裡 `industries` 的其中一個，篩選和上一位、下一位才會正確
- `order` 決定排列順序
- `skills` 每一項寫 `name`（名稱）和 `desc`（一句說明），會顯示成兩欄卡片；只寫名稱也可以
- `seekingPartners` 是「想找的合作夥伴」，會用黑色標籤醒目顯示
- `contact` 留空的欄位不會顯示

### 新增一則案例

- `members` 填參與會員的檔名（不含 .md），會員頁和案例頁會自動互相連結
- `roles` 寫每位會員在這個案例負責什麼，會顯示在「這次的分工」
- `featured: true` 加上 `featuredOrder: 1~4`，就會出現在首頁 Hero 輪播
- `heroImage` 是桌機用的去背人物圖（橫式構圖），`heroImageMobile` 是手機用的（直式構圖）
- 上架前請取得當事會員與客戶的同意，必要時匿名處理

### 新增一週教育

- `week` 是週次，決定排序和上一週、下一週
- `podcast` 三個欄位一定要填：集數、英文原標題、原始連結
- `relatedCases` 填對應案例的檔名，文章和案例會互相連結
- 內文用單獨一行的 `---` 分段，每一段就是「投影模式」的一張投影片
- 例會時打開 `/education/<檔名>/present`，按方向鍵或點畫面翻頁，按 `f` 全螢幕

## 自動產生的標籤

下面這些標籤不需要手動填，網站會從案例資料自動算出來：

- 案例頁的「跨產業」：參與會員的產業
- 會員頁的「合作過的夥伴」與次數、「合作過的產業」：這位會員出現過的所有案例
- 教育頁的「案例產業」、「案例夥伴」：這週對應的案例

紅框的產業標籤點下去，會直接帶到該產業的會員篩選。所以每次合作只要在案例裡記一次，三種頁面都會同步更新。

## 部署

1. 在 GitHub 建一個新的 repo，把這個資料夾推上去
2. 到 Vercel 選 Add New → Project，匯入這個 repo，框架會自動判斷成 Next.js，其他設定用預設值
3. 在 Vercel 的 Settings → Environment Variables 加上 `NEXT_PUBLIC_SITE_URL`，值是正式網址（例如 `https://yixin.example.com`），沒設的話會用 `content/site.json` 的 `url`
4. 綁定自己的網域後，記得同步更新上面的網址，sitemap、canonical、分享預覽才會指向正確的網址
5. 之後每次推送到 main，網站會自動更新

## SEO 與 GEO

- 每一頁都有 canonical、Open Graph 分享資訊，預設分享圖是 `public/og.png`；會員照片或案例封面填了之後，會自動改用那張圖
- 結構化資料（JSON-LD）：首頁是 Organization，會員頁是 ProfilePage + Person，案例頁是 Article，教育頁是 BlogPosting，並用 `isBasedOn` 標註原始的 Podcast 集數，每一頁都有麵包屑
- `/sitemap.xml`、`/robots.txt` 會依內容自動產生
- `/llms.txt` 是給 AI 助理讀的網站摘要，列出所有會員、案例和教育文章，讓 ChatGPT、Claude、Perplexity 介紹分會時有正確的資料可以引用
- 上線後，到 Google Search Console 提交 sitemap

## 交接

網站目前由 Adolph 維護。接手的人需要：GitHub repo 的權限、Vercel 專案的權限、網域 DNS 的管理權。
日常更新只要改 `content/` 底下的檔案，不需要碰程式碼。

## 待辦

- 視覺規範 v0.1：品牌色藏紅 #A3243B、靛藍 #1F3A68，完整色票與用法在網站 `/brand` 頁，色彩變數在 `src/app/globals.css`
- 向董事顧問與區域確認 BNI 品牌使用規範
- 會員專業上架資料申請頁（另外設計，不用 Google 表單）
- 把範例內容換成真實內容
