
## 初期インストール
1) .env.sample をコピーして .env を作成。必要に応じて設定を変更

```env
HOSTNAME="localhost"
PORT=3000
```

2) ターミナルコマンドでモジュールインストール

```bash
npm i
```

## クライアントアプリ起動
1) next-chat-server プロジェクトでチャットサーバ起動

2) ターミナルコマンドでモジュールインストール

```bash
npm run dev
```

```bash
npx prisma migrate dev --name init
```

#### migrate
```bash
npx prisma migrate dev
```

### Prisma Client

```bash
npx prisma studio
```
## Git Rebase
```bash
git config pull.rebase false
git pull
```