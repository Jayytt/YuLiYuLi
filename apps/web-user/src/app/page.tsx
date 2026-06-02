export default function Home() {
  return (
    <div className="min-h-screen bg-bili-bg">
      <header className="bg-white shadow-sm">
        <div className="container-bili h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-bili-pink text-xl font-bold">YuLiYuLi</h1>
            <nav className="flex gap-4 text-sm">
              <a href="#" className="hover:text-bili-pink">首页</a>
              <a href="#" className="hover:text-bili-pink">动画</a>
              <a href="#" className="hover:text-bili-pink">番剧</a>
              <a href="#" className="hover:text-bili-pink">游戏</a>
              <a href="#" className="hover:text-bili-pink">音乐</a>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="搜索视频"
              className="input-bili w-64"
            />
            <button className="btn-bili btn-bili-primary">登录</button>
          </div>
        </div>
      </header>
      <main className="container-bili py-4">
        <div className="text-center py-20 text-bili-text-secondary">
          <p className="text-lg">YuLiYuLi — B站风格视频平台</p>
          <p className="mt-2">Phase 1 基础搭建完成</p>
        </div>
      </main>
    </div>
  );
}
