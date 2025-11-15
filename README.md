# RimWorld Mod Maker

TypeScript 框架，用於以程式化方式建立 RimWorld 模組。

## 專案結構

- defs/ 定義系統（defs）- RimWorld 各種定義類型
- components/ 組件系統（components）- 模組化的定義組件
- utils.ts 工具函數與類型定義 (並重新導入下列)
    - xml.ts XML 生成與操作工具
    - io.ts 檔案相關操作工具

### 小工具集

#### `dumper.py`
從 RimWorld 遊戲資料目錄提取 XML 定義並生成 TypeScript 類型檔案。 (src/defs/vanilla.ts)
```bash
python tools/dumper.py
```