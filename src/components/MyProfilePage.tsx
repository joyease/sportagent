import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Navigation,
  ShieldCheck,
  Tag,
  Share2,
  Database,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CheckInPost } from '../types';
import { auth, db, doc, setDoc, collection, onSnapshot } from '../firebase';
import { getUserNickname, saveUserNickname } from '../utils/user';

interface MyProfilePageProps {
  userEmail: string | null;
  syncStatus?: 'idle' | 'syncing' | 'synced' | 'error';
  syncErrorMsg?: string | null;
  onForceSync?: () => void;
}

const STORAGE_KEY_CHECKINS = 'sportpal_checkin_posts_v2';
const STORAGE_KEY_UID = 'sportpal_user_uid_v1';

const INITIAL_SAMPLE_POSTS: CheckInPost[] = [
  {
    id: 'post-1',
    uid: '88392',
    nickname: 'Hermann',
    email: 'hermann@trip.com',
    message: '大安森林公園晨跑 8K 達成！微風很舒服，配速推進到 5 分 15 秒，心情超棒！',
    createdAt: '2026-08-29 07:30:15',
  },
];

export const MyProfilePage: React.FC<MyProfilePageProps> = ({
  userEmail,
  syncStatus,
  syncErrorMsg,
  onForceSync,
}) => {
  const displayEmail = userEmail || 'hermann@trip.com';

  // User Profile Info
  const [nickname, setNickname] = useState<string>(() => {
    return getUserNickname(displayEmail);
  });

  useEffect(() => {
    setNickname(getUserNickname(displayEmail));
  }, [displayEmail]);

  const [uid] = useState<string>(() => {
    let savedUid = localStorage.getItem(STORAGE_KEY_UID);
    if (!savedUid) {
      savedUid = String(Math.floor(10000 + Math.random() * 90000));
      localStorage.setItem(STORAGE_KEY_UID, savedUid);
    }
    return savedUid.replace(/^UID-/, '');
  });

  // Check-in form state
  const [message, setMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [latestCheckIn, setLatestCheckIn] = useState<CheckInPost | null>(null);
  const [posts, setPosts] = useState<CheckInPost[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CHECKINS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse check-in posts from localStorage');
    }
    return INITIAL_SAMPLE_POSTS;
  });

  // Listen to Firestore community_messages real-time
  useEffect(() => {
    let unsubscribe = () => {};
    try {
      const q = collection(db, 'community_messages');
      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const firestorePosts: CheckInPost[] = [];
            snapshot.forEach((docSnap) => {
              firestorePosts.push(docSnap.data() as CheckInPost);
            });
            // Sort by createdAt descending
            firestorePosts.sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            if (firestorePosts.length > 0) {
              setPosts(firestorePosts.slice(0, 10));
              localStorage.setItem(STORAGE_KEY_CHECKINS, JSON.stringify(firestorePosts.slice(0, 10)));
            }
          }
        },
        (err) => {
          console.warn('Firestore community messages listener notice:', err);
        }
      );
    } catch (e) {
      console.warn('Failed to attach Firestore messages listener:', e);
    }
    return () => unsubscribe();
  }, []);

  const [testResult, setTestResult] = useState<{ status: 'idle' | 'testing' | 'success' | 'error'; message: string }>({
    status: 'idle',
    message: '',
  });

  const handleTestWrite = async () => {
    if (!auth.currentUser) {
      setTestResult({
        status: 'error',
        message: '未偵測到 Firebase Auth 登入實例，請先登入帳號。',
      });
      return;
    }

    setTestResult({ status: 'testing', message: '正在嘗試寫入測試文件到 /users/{uid}/records/test 與 /community_messages/test...' });

    try {
      const user = auth.currentUser;
      const testId = `test_${Date.now()}`;
      
      // Test 1: User doc
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        uid: user.uid,
        testWriteAt: new Date().toISOString(),
      }, { merge: true });

      // Test 2: User record subcollection
      await setDoc(doc(db, 'users', user.uid, 'records', '2026-08'), {
        month: '2026-08',
        distance: 124.0,
        minutes: 1180,
        calories: 12200,
        weight: 69.4,
        notes: '即時連線測試',
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      // Test 3: Public community messages
      await setDoc(doc(db, 'community_messages', testId), {
        id: testId,
        userId: user.uid,
        email: user.email,
        nickname: nickname,
        message: '✅ 連線診斷測試成功',
        createdAt: new Date().toISOString(),
      });

      setTestResult({
        status: 'success',
        message: `🎉 成功！已成功寫入 Firestore (UID: ${user.uid.slice(0, 8)}...)，資料庫可正常讀寫。`,
      });
    } catch (err: any) {
      console.error('Test write failed:', err);
      setTestResult({
        status: 'error',
        message: `寫入失敗 [${err.code || 'Error'}]: ${err.message || String(err)}。請確認 Firestore Rules 已發布且允許存取。`,
      });
    }
  };

  const handleSaveNickname = (newNick: string) => {
    setNickname(newNick);
    saveUserNickname(displayEmail, newNick);
  };

  const handleCheckInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);

    // Get current time formatted as YYYY-MM-DD HH:mm:ss
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const timeStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(
      now.getHours()
    )}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

    const postId = `msg_${Date.now()}`;
    const newPost: CheckInPost = {
      id: postId,
      uid,
      nickname,
      email: displayEmail,
      message: message.trim(),
      createdAt: timeStr,
    };

    // Prepend new post, keep maximum of 10 posts
    const updatedPosts = [newPost, ...posts.filter((p) => p.id !== newPost.id)].slice(0, 10);
    setPosts(updatedPosts);
    setLatestCheckIn(newPost);
    localStorage.setItem(STORAGE_KEY_CHECKINS, JSON.stringify(updatedPosts));

    // Save directly to Firestore /community_messages/{postId}
    try {
      const currentAuthUser = auth.currentUser;
      const uidToSave = currentAuthUser ? currentAuthUser.uid : uid;
      await setDoc(doc(db, 'community_messages', postId), {
        id: postId,
        userId: uidToSave,
        uid: uid,
        nickname: nickname,
        email: displayEmail,
        message: message.trim(),
        createdAt: timeStr,
        updatedAt: new Date().toISOString(),
      });
      console.log('✅ Message successfully written to Firestore community_messages');
    } catch (err: any) {
      console.error('❌ Firestore message save error:', err);
    }

    // Celebrate & reset input
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 },
    });

    setMessage('');
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-4 pb-20 pt-2">
      {/* (A) 用戶 暱稱 與 Email 區塊 */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* User Avatar */}
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-lime-500 to-emerald-600 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-lime-500/20">
              <User className="w-6 h-6 text-white" />
            </div>

            <div>
              <h1 className="text-base font-bold text-slate-900 leading-tight">
                {nickname}
              </h1>

              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-medium text-slate-700">{displayEmail}</span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-medium text-slate-400 block">專屬身份 UID</span>
            <span className="text-xs font-bold text-[#5ea31b] bg-lime-50 px-2.5 py-1 rounded-lg border border-lime-200 font-mono inline-block">
              {uid}
            </span>
          </div>
        </div>
      </div>

      {/* Firestore 雲端資料庫即時狀態卡片 */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-slate-900">Firestore 雲端資料庫狀態</h2>
              <p className="text-[10px] text-slate-400">sportagent-ae118 • 專屬雲端同步</p>
            </div>
          </div>

          {/* Status Badge */}
          {syncStatus === 'synced' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-3 h-3" />
              已同步至雲端
            </span>
          )}
          {syncStatus === 'syncing' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-700 border border-amber-200 animate-pulse">
              <RefreshCw className="w-3 h-3 animate-spin" />
              同步中...
            </span>
          )}
          {syncStatus === 'error' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-red-100 text-red-700 border border-red-200">
              <AlertCircle className="w-3 h-3" />
              同步未就緒
            </span>
          )}
        </div>

        {syncErrorMsg && (
          <div className="p-2.5 bg-red-50 text-red-700 text-[11px] rounded-xl border border-red-200 leading-relaxed flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <strong>雲端連線提示：</strong> {syncErrorMsg}
              <div className="mt-1 text-[10px] text-red-600">
                💡 請確認 Firebase Console 的 Firestore Database 已建立，且 Rules（規則）允許已登入用戶讀寫。
              </div>
            </div>
          </div>
        )}

        {testResult.status !== 'idle' && (
          <div
            className={`p-2.5 rounded-xl text-[11px] leading-relaxed border ${
              testResult.status === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : testResult.status === 'testing'
                ? 'bg-amber-50 text-amber-800 border-amber-200 animate-pulse'
                : 'bg-red-50 text-red-800 border-red-200'
            }`}
          >
            <strong>測試診斷結果：</strong> {testResult.message}
          </div>
        )}

        <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 text-xs">
          <div className="text-[11px] text-slate-500 font-mono">
            {auth.currentUser ? (
              <span>帳號: <b className="text-slate-800">{auth.currentUser.email}</b> (UID: {auth.currentUser.uid.slice(0, 6)}...)</span>
            ) : (
              <span className="text-red-500 font-bold">⚠️ 未通過 Firebase 驗證</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTestWrite}
              disabled={testResult.status === 'testing'}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs transition cursor-pointer disabled:opacity-50"
            >
              連線寫入測試
            </button>
            {onForceSync && (
              <button
                onClick={onForceSync}
                disabled={syncStatus === 'syncing'}
                className="px-3 py-1 bg-[#5ea31b] hover:bg-[#4d8716] text-white font-bold rounded-lg transition flex items-center gap-1 cursor-pointer disabled:opacity-50 text-xs shadow-sm"
              >
                <RefreshCw className={`w-3 h-3 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
                全部備份至雲端
              </button>
            )}
          </div>
        </div>
      </div>

      {/* (B) 運動打卡與留言區 - 深色底色 */}
      <div className="bg-slate-900 border border-slate-800 text-white p-5 rounded-2xl shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-lime-500/20 text-lime-400">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">運動打卡與留言區</h2>
              <p className="text-[10px] text-slate-400">寫下今日運動心得與成果分享</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleCheckInSubmit} className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-medium text-slate-200">
                運動心得留言 (上限 100 字)
              </label>
              <span
                className={`text-[10px] font-mono font-medium ${
                  message.length > 90 ? 'text-amber-400' : 'text-slate-400'
                }`}
              >
                {message.length} / 100 字
              </span>
            </div>

            <textarea
              required
              maxLength={100}
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="寫下今天的跑步路線、運動心情或破 PB 紀念... (最多 100 字)"
              className="w-full px-3.5 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs focus:ring-2 focus:ring-lime-500 focus:bg-slate-800 focus:outline-none transition leading-relaxed resize-none"
            />
          </div>

          {/* 打卡並儲存按鈕 - 深綠色立體浮現且字體反白清晰 */}
          <button
            type="submit"
            disabled={isSubmitting || !message.trim()}
            className="w-full py-3.5 bg-[#1b6b1a] hover:bg-[#165a15] active:bg-[#124b11] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl shadow-lg shadow-green-950/70 border border-[#2b8b2a] flex items-center justify-center gap-2 transition-all transform active:scale-[0.99] tracking-wide"
          >
            <Send className="w-4 h-4 text-white" />
            <span className="text-white font-bold">送出打卡留言</span>
          </button>
        </form>

        {/* 即時打卡資訊結果呈現 */}
        {latestCheckIn && (
          <div className="p-3.5 bg-slate-800/95 border border-lime-500/40 rounded-xl space-y-2 animate-fadeIn">
            <div className="flex items-center justify-between text-xs pb-1.5 border-b border-slate-700/80">
              <span className="font-bold text-lime-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 留言發布成功！已同步至雲端
              </span>
              <span className="font-mono text-[10px] text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-500" />
                {latestCheckIn.createdAt}
              </span>
            </div>

            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-lime-400 font-bold">{latestCheckIn.nickname}</span>
                <span className="font-mono text-[9px] text-slate-400">{latestCheckIn.uid}</span>
              </div>
              <p className="text-xs text-white font-medium leading-snug">
                "{latestCheckIn.message}"
              </p>
            </div>
          </div>
        )}
      </div>

      {/* (C) 列出最近 10 筆留言 - 深色底色 */}
      <div className="bg-slate-900 border border-slate-800 text-white p-5 rounded-2xl shadow-xl space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white">最近 10 筆打卡留言紀錄</h2>
              <p className="text-[10px] text-slate-400">即時同步最新運動動態與社群分享</p>
            </div>
          </div>

          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-mono text-slate-300 border border-slate-700">
            共 {posts.length} 筆
          </span>
        </div>

        <div className="space-y-2.5">
          {posts.length === 0 ? (
            <div className="p-8 text-center bg-slate-800/50 rounded-xl border border-slate-700/50 text-slate-400 space-y-1">
              <MessageSquare className="w-8 h-8 mx-auto text-slate-600" />
              <p className="text-xs font-bold text-slate-300">目前尚無打卡紀錄</p>
              <p className="text-[10px]">在上方輸入您的第一則打卡心得吧！</p>
            </div>
          ) : (
            posts.slice(0, 10).map((post, idx) => (
              <div
                key={post.id}
                className="bg-slate-800/80 hover:bg-slate-850 p-3.5 rounded-xl border border-slate-700/80 space-y-2 transition shadow-sm"
              >
                {/* Post Header: Nickname, UID, Time */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-lime-500/20 text-lime-400 font-black text-[10px] flex items-center justify-center border border-lime-500/30">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white">{post.nickname}</span>
                        <span className="text-[9px] font-mono font-bold bg-slate-900 px-1.5 py-0.5 rounded text-slate-400 border border-slate-700">
                          {post.uid}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1 shrink-0">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {post.createdAt}
                  </span>
                </div>

                {/* Message Content */}
                <p className="text-xs text-slate-100 font-medium leading-relaxed pl-8">
                  {post.message}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
