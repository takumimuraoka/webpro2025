import express from 'express';
// 生成した Prisma Client をインポートします。
// 必ず、`./generated/prisma/client` からインポートするようにするのじゃぞ。
import { PrismaClient } from './generated/prisma/client';

// PrismaClient のインスタンスを作成します。
const prisma = new PrismaClient({
  // クエリが実行されたときに実際に実行したクエリをログに表示する設定
  log: ['query'],
});

// Express アプリケーションのインスタンスを作成します。
const app = express();

// サーバーが待ち受けるポート番号を定義します。
// 環境変数が設定されていれば、そこからポート番号を取得する。環境変数に設定がなければ 8888 を使用する。
const PORT = process.env.PORT || 8888;

// EJS をテンプレートエンジンとして設定します。
// 'view engine' に 'ejs' を指定することで、ExpressがEJSを使ってテンプレートをレンダリングするようになるぞ。
app.set('view engine', 'ejs');
// テンプレートファイル（.ejsファイル）が保存されているディレクトリを設定します。
// ここでは、アプリケーションのルートディレクトリにある 'views' フォルダを指定しておる。
app.set('views', './views');

// form のデータを受け取れるように設定します。
// これがないと、HTMLのフォームから送られたデータ（例えばユーザーの名前など）を受け取れないのじゃ。
app.use(express.urlencoded({ extended: true }));

// ルート ('/') へのGETリクエストを処理するハンドラーです。
// ブラウザから http://localhost:8888/ にアクセスしたときに、この処理が実行されるぞ。
app.get('/', async (req, res) => {
  // データベースからすべてのユーザーデータを取得します。
  const users = await prisma.user.findMany();
  // 'index.ejs' テンプレートをレンダリングし、取得したユーザーデータを渡します。
  // これにより、ejsファイル内で users 変数を使ってデータを表示できるのじゃ。
  res.render('index', { users });
});

// '/users' へのPOSTリクエストを処理するハンドラーです。
// HTMLフォームからユーザーを追加するリクエストが来たときに、この処理が実行されるぞ。
app.post('/users', async (req, res) => {
  // フォームから送信された 'name' の値を取得します。
  const name = req.body.name;
  if (name) {
    // 名前が入力されていれば、新しいユーザーをデータベースに追加します。
    const newUser = await prisma.user.create({
      data: { name },
    });
    console.log('新しいユーザーを追加しました:', newUser);
  }
  // ユーザー追加後、ルートページ ('/') にリダイレクトします。
  // これで、追加後のユーザー一覧がすぐに更新されて表示されるのじゃ。
  res.redirect('/');
});

// サーバーを起動し、指定されたポートで待ち受けます。
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});