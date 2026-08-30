import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Send,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Clock,
  ChevronDown,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CheckInPost } from '../types';
import { auth, db, doc, setDoc, collection, onSnapshot } from '../firebase';
import { getUserNickname } from '../utils/user';

interface MyProfilePageProps {
  userEmail: string | null;
  syncStatus?: 'idle' | 'syncing' | 'synced' | 'error';
  syncErrorMsg?: string | null;
  onForceSync?: () => void;
}

const STORAGE_KEY_CHECKINS = 'sportpal_checkin_posts_v3';
const STORAGE_KEY_UID = 'sportpal_user_uid_v1';

const INITIAL_COMMUNITY_POSTS: CheckInPost[] = [
  {
    id: 'post-1',
    uid: '88392',
    nickname: 'Hermann',
    email: 'hermann@trip.com',
    message: '大安森林公園晨跑 8K 達成！微風很舒服，配速推進到 5 分 15 秒，心情超棒！',
    createdAt: '2026-08-29 07:30:15',
  },
  {
    id: 'post-2',
    uid: '74129',
    nickname: 'Tom',
    email: 'tom@trip.com',
    message: '風櫃嘴單車爬坡攻頂！今天爬升 850m，燃燒 1200 卡，下山豆花太好吃了！',
    createdAt: '2026-08-28 16:45:20',
  },
  {
    id: 'post-3',
    uid: '63214',
    nickname: 'Annie',
    email: 'annie@trip.com',
    message: '象山夜跑階梯訓練，夜景超美！每週固定維持 3 次運動，體重成功降了 2kg。',
    createdAt: '2026-08-28 20:10:00',
  },
  {
    id: 'post-4',
    uid: '91823',
    nickname: 'David',
    email: 'david@trip.com',
    message: '河濱 15km 漸速跑完賽，心率穩定在 145，下半年半馬賽事準備好了！',
    createdAt: '2026-08-27 18:20:30',
  },
  {
    id: 'post-5',
    uid: '52910',
    nickname: 'Kelly',
    email: 'kelly@trip.com',
    message: '早起瑜伽 45 分鐘 + 核心肌群深蹲，感覺精神百倍，準備迎接挑戰！',
    createdAt: '2026-08-27 06:50:12',
  },
  {
    id: 'post-6',
    uid: '88392',
    nickname: 'Hermann',
    email: 'hermann@trip.com',
    message: '週末合歡山北峰單攻！高山空氣清新，心肺訓練強度很夠，視野壯闊！',
    createdAt: '2026-08-26 14:15:00',
  },
  {
    id: 'post-7',
    uid: '47182',
    nickname: 'Mark',
    email: 'mark@trip.com',
    message: '重訓深蹲突破 100kg！配合跑步交叉訓練，膝蓋穩定度明顯提升很多。',
    createdAt: '2026-08-25 19:30:40',
  },
  {
    id: 'post-8',
    uid: '74129',
    nickname: 'Tom',
    email: 'tom@trip.com',
    message: '台北馬拉松倒數訓練中，今天 12k 配速跑順利完成，大家一起加油！',
    createdAt: '2026-08-25 08:00:10',
  },
  {
    id: 'post-9',
    uid: '38192',
    nickname: 'Sophia',
    email: 'sophia@trip.com',
    message: '早安健走 6 公里，累積步數破萬！呼吸清晨涼爽空氣真是一天最棒的開始。',
    createdAt: '2026-08-24 07:10:25',
  },
  {
    id: 'post-10',
    uid: '63214',
    nickname: 'Annie',
    email: 'annie@trip.com',
    message: '運動後補充無糖高纖豆漿與茶葉蛋，肌肉修復滿分，明天繼續保持！',
    createdAt: '2026-08-23 21:05:15',
  },
  {
    id: 'post-11',
    uid: '88392',
    nickname: 'Hermann',
    email: 'hermann@trip.com',
    message: '田中馬拉松報名成功！今年目標突破 1 小時 55 分完賽，為自己加油！',
    createdAt: '2026-08-22 12:00:00',
  },
  {
    id: 'post-12',
    uid: '91823',
    nickname: 'David',
    email: 'david@trip.com',
    message: '週末單車北海岸 60km 巡航，雖然逆風但大家一起輪車很有成就感。',
    createdAt: '2026-08-21 16:30:00',
  },
  {
    id: 'post-13',
    uid: '52910',
    nickname: 'Kelly',
    email: 'kelly@trip.com',
    message: '間歇跑訓練 800m x 5 趟，雖然喘但突破速度極限的感覺太痛快了！',
    createdAt: '2026-08-20 19:40:10',
  },
  {
    id: 'post-14',
    uid: '47182',
    nickname: 'Mark',
    email: 'mark@trip.com',
    message: '連續打卡運動第 30 天達成！習慣養成後一天沒動渾身不對勁。',
    createdAt: '2026-08-19 22:15:30',
  },
  {
    id: 'post-15',
    uid: '38192',
    nickname: 'Sophia',
    email: 'sophia@trip.com',
    message: '陽明山東西大縱走初體驗，耗時 7 小時完賽，雙腿痠痛但心靈充實！',
    createdAt: '2026-08-18 17:50:00',
  },
  {
    id: 'post-16',
    uid: '74129',
    nickname: 'Tom',
    email: 'tom@trip.com',
    message: '更換了新的碳板跑鞋，回彈推進感驚人，5k 測試輕鬆刷新 PB！',
    createdAt: '2026-08-17 07:45:00',
  },
  {
    id: 'post-17',
    uid: '63214',
    nickname: 'Annie',
    email: 'annie@trip.com',
    message: '中秋團練河濱星光夜跑，感謝夥伴們帶跑，不知不覺就刷了 10k。',
    createdAt: '2026-08-16 20:30:15',
  },
  {
    id: 'post-18',
    uid: '88392',
    nickname: 'Hermann',
    email: 'hermann@trip.com',
    message: '本月運動里程正式突破 120km 目標！給自己買了條運動毛巾當獎勵。',
    createdAt: '2026-08-15 18:20:00',
  },
  {
    id: 'post-19',
    uid: '91823',
    nickname: 'David',
    email: 'david@trip.com',
    message: '雨天備案：室內跑步機配速跑 45 分鐘 + 核心平板支撐 3 組。',
    createdAt: '2026-08-14 19:10:00',
  },
  {
    id: 'post-20',
    uid: '52910',
    nickname: 'Kelly',
    email: 'kelly@trip.com',
    message: '休假日常爬七星山主東峰，雲海美得像仙境，戶外運動就是最棒的充電！',
    createdAt: '2026-08-13 11:30:00',
  },
];

export const MyProfilePage: React.FC<MyProfilePageProps> = ({ userEmail }) => {
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

  // Pagination for posts (show in batches of 10)
  const [visibleCount, setVisibleCount] = useState<number>(10);

  const [allPosts, setAllPosts] = useState<CheckInPost[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CHECKINS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse check-in posts from localStorage');
    }
    return INITIAL_COMMUNITY_POSTS;
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
              // Merge with sample posts ensuring uniqueness
              const mergedMap = new Map<string, CheckInPost>();
              firestorePosts.forEach((p) => mergedMap.set(p.id, p));
              INITIAL_COMMUNITY_POSTS.forEach((p) => {
                if (!mergedMap.has(p.id)) {
                  mergedMap.set(p.id, p);
                }
              });
              const mergedList = Array.from(mergedMap.values()).sort(
                (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
              );
              setAllPosts(mergedList);
              localStorage.setItem(STORAGE_KEY_CHECKINS, JSON.stringify(mergedList));
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

    // Prepend new post
    const updatedPosts = [newPost, ...allPosts.filter((p) => p.id !== newPost.id)];
    setAllPosts(updatedPosts);
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

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  const displayedPosts = allPosts.slice(0, visibleCount);
  const hasMore = visibleCount < allPosts.length;

  return (
    <div className="space-y-4 pb-24 pt-2">
      {/* (A) 用戶 暱稱 與 Email 區塊 */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* User Avatar */}
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-lime-500 to-emerald-600 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-lime-500/20">
              <User className="w-6 h-6 text-white" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-black text-slate-900 leading-tight">
                  留言與社群分享
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-lime-100 text-[#5ea31b]">
                  {nickname}
                </span>
              </div>

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

      {/* (B) 我要留言 - 深色底色 */}
      <div className="bg-slate-900 border border-slate-800 text-white p-5 rounded-2xl shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-lime-500/20 text-lime-400">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white">我要留言</h2>
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

          {/* 送出按鈕名稱改為 送出留言 */}
          <button
            type="submit"
            disabled={isSubmitting || !message.trim()}
            className="w-full py-3.5 bg-[#1b6b1a] hover:bg-[#165a15] active:bg-[#124b11] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl shadow-lg shadow-green-950/70 border border-[#2b8b2a] flex items-center justify-center gap-2 transition-all transform active:scale-[0.99] tracking-wide cursor-pointer"
          >
            <Send className="w-4 h-4 text-white" />
            <span className="text-white font-bold">送出留言</span>
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

      {/* (C) 社群最新10筆留言 - 深色底色 */}
      <div className="bg-slate-900 border border-slate-800 text-white p-5 rounded-2xl shadow-xl space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white">社群最新10筆留言</h2>
              <p className="text-[10px] text-slate-400">即時同步最新運動動態與社群分享</p>
            </div>
          </div>

          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-mono text-slate-300 border border-slate-700">
            顯示 {displayedPosts.length} / 共 {allPosts.length} 筆
          </span>
        </div>

        <div className="space-y-2.5">
          {displayedPosts.length === 0 ? (
            <div className="p-8 text-center bg-slate-800/50 rounded-xl border border-slate-700/50 text-slate-400 space-y-1">
              <MessageSquare className="w-8 h-8 mx-auto text-slate-600" />
              <p className="text-xs font-bold text-slate-300">目前尚無留言紀錄</p>
              <p className="text-[10px]">在上方輸入您的第一則留言吧！</p>
            </div>
          ) : (
            displayedPosts.map((post, idx) => (
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

        {/* 查看更多留言>>> 點擊後每次加載 10 筆 */}
        {hasMore && (
          <div className="pt-2 text-center border-t border-slate-800">
            <button
              type="button"
              onClick={handleLoadMore}
              className="text-xs font-semibold text-lime-400 hover:text-lime-300 hover:underline inline-flex items-center gap-1 py-1.5 px-3 rounded-lg hover:bg-slate-800/60 transition cursor-pointer"
            >
              查看更多留言 &gt;&gt;&gt;
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
