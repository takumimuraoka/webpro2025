// Node.jsの標準ライブラリである 'node:http' をインポートします。
// これを使ってHTTPサーバーを作成します。
import * as http from 'node:http';
// Node.jsの標準ライブラリである 'node:url' をインポートします。
// URLの解析に利用します。
import { URL } from 'node:url'; // URLオブジェクトはグローバルでも利用できますが、明示的にインポートすることも可能です。

// サーバーが待ち受けるポート番号を定義します。
// 環境変数にPORTが設定されていればそれを使用し、なければ8888を使います。
const PORT = process.env.PORT || 8888;

// HTTPサーバーを作成します。
// reqはリクエスト（ブラウザからの要求）、resはレスポンス（サーバーからの応答）を表します。
const server = http.createServer((req, res) => {
  // リクエストURLを解析します。
  // trueを設定すると、クエリ文字列も自動的に解析してくれます。
  const parsedUrl = new URL(req.url || '/', `http://localhost:${PORT}`);
  const pathname = parsedUrl.pathname; // パス名（例: / や /ask）
  const query = parsedUrl.searchParams; // クエリパラメータ（例: ?q=my+question）

  // レスポンスヘッダーを設定します。
  // Content-Typeを'text/plain; charset=utf-8'に設定することで、日本語が正しく表示されるようになります。
  // この時点ではステータスコードは指定せず、setHeaderで追加していくとよいぞ。
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');

  // どこが実行されたか確認するためのログ
  console.log(`Received request for: ${req.url}`);

  // ルーティング（リクエストのパスによって処理を振り分けること）
  if (pathname === '/') {
    // http://localhost:8888/ にアクセスした場合
    console.log("アクセスパス: ルート ('/')");
    res.writeHead(200); // ステータスコード200 (OK) を設定
    res.end('こんにちは！'); // "こんにちは！" と応答
  } else if (pathname === '/ask') {
    // http://localhost:8888/ask?q={質問} にアクセスした場合
    const question = query.get('q'); // 'q' パラメータの値を取得
    console.log(`アクセスパス: /ask, 質問: ${question}`);
    if (question) {
      res.writeHead(200); // ステータスコード200 (OK) を設定
      res.end(`Your question is '${decodeURIComponent(question)}'`); // 質問内容を応答
    } else {
      // 'q' パラメータがない場合
      console.log("エラー: 'q' パラメータが見つかりません。");
      res.writeHead(400); // ステータスコード400 (Bad Request) を設定
      res.end('質問が指定されていません。');
    }
  } else {
    // その他のパスにアクセスした場合
    console.log(`アクセスパス: ${pathname} (不明なパス)`);
    res.writeHead(404); // ステータスコード404 (Not Found) を設定
    res.end('おっと、そのページは見つからぬようじゃ…');
  }
});

// サーバーを指定されたポートで待ち受けます。
server.listen(PORT, () => {
  console.log(`サーバーは http://localhost:${PORT} で動いておるぞ！`);
});