# 東京23区クイズアプリ

東京23区の場所を覚えるためのクイズアプリです。React + Viteで構築されており、PWA対応でスマートフォンのホーム画面に追加できます。

## 機能

- 23区が個別に分かれた正確なSVG地図を表示（GeoJSONデータ使用）
- ランダムに区名が出題される
- 地図をクリックして正解/不正解を判定
- 正解なら緑、不正解なら赤く光る
- スコア表示機能
- PWA対応（オフライン利用可能、ホーム画面に追加可能）

## セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# ビルド
npm run build

# ビルド結果のプレビュー
npm run preview
```

## GeoJSONデータの取得と配置

このアプリは正確な東京23区の境界線データ（GeoJSON形式）を使用します。以下のいずれかの方法でデータを取得してください：

### 方法1: 国土数値情報から取得（推奨）

1. [国土数値情報ダウンロードサイト](https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N03-2024.html)にアクセス
2. 「行政区域データ（N03）」の最新版を選択
3. 東京都（都コード13）のGeoJSON形式をダウンロード
4. ダウンロードしたファイルから、23区のみを抽出
5. `public/tokyo23.json` として保存

### 方法2: GitHubリポジトリから取得

1. [utisz/compound-cities](https://github.com/utisz/compound-cities) リポジトリにアクセス
2. `tokyo/tokyo.geo.json` ファイルをダウンロード
3. `public/tokyo23.json` として保存

### 方法3: ArcGIS RESTサービスから取得

以下のURLからGeoJSONデータを取得できます：

```
https://isrs-gis.bosai.go.jp/webgis/rest/services/dep_mizu/tokyo23area/MapServer/0/query?where=1=1&outFields=*&f=geojson
```

取得したデータを `public/tokyo23.json` として保存してください。

### GeoJSONデータの形式

GeoJSONファイルは以下の形式である必要があります：

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "N03_004": "千代田区",  // または "name", "ward_name" など
        ...
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[...]]
      }
    },
    ...
  ]
}
```

区名は以下のプロパティ名から自動的に検出されます：
- `N03_004` (国土数値情報)
- `name`
- `ward_name`
- `NAME_JA`
- `区名`

## PWAアイコンの追加

PWAアイコンを追加するには、以下のいずれかの方法を使用できます：

### 方法1: 自動生成ツールを使用

1. 開発サーバーを起動: `npm run dev`
2. ブラウザで `http://localhost:5173/generate-icons.html` にアクセス
3. ボタンをクリックしてアイコンを生成・ダウンロード
4. ダウンロードしたファイルを `public` フォルダに配置

### 方法2: 手動で作成

以下のサイズのPNG画像を `public` フォルダに配置してください：

- `pwa-192x192.png` (192x192ピクセル)
- `pwa-512x512.png` (512x512ピクセル)

これらのアイコンは、アプリをホーム画面に追加した際に表示されます。

## 使い方

1. アプリを開くと、ランダムに23区の名前が表示されます
2. 地図上で該当する区をクリックします
3. 正解なら緑、不正解なら赤く光ります
4. 「次の問題」ボタンで次の問題に進みます
5. スコアは画面上部に表示されます

## 技術スタック

- React 18
- Vite
- d3-geo (地図描画)
- vite-plugin-pwa

## ライセンス

MIT
