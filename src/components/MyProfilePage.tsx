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
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CheckInPost } from '../types';

interface MyProfilePageProps {
  userEmail: string | null;
}

const STORAGE_KEY_CHECKINS = 'sportpal_checkin_posts_v1';
const STORAGE_KEY_NICKNAME = 'sportpal_user_nickname_v1';
const STORAGE_KEY_UID = 'sportpal_user_uid_v1';

const INITIAL_SAMPLE_POSTS: CheckInPost[] = [
  {
    id: 'post-1',
    uid: '88392',
    nickname: '健跑達人 Hermann',
    email: 'hermanntalk@gmail.com',
    message: '大安森林公園晨跑 8K 達成！微風很舒服，配速推進到 5 分 15 秒，心情超棒！',
    gps: {
      lat: 25.0270,
      lng: 121.5360,
      locationName: '台北大安森林公園',
    },
    createdAt: '2026-08-29 07:30:15',
  },
  {
    id: 'post-2',
    uid: '88392',
    nickname: '健跑達人 Hermann',
    email: 'hermanntalk@gmail.com',
    message: '河濱自行車道騎乘 25km，均速 24km/h，補給一瓶電解質水，順利完成週末課表！',
    gps: {
      lat: 25.0515,
      lng: 121.5780,
      locationName: '彩虹河濱公園',
    },
    createdAt: '2026-08-28 18:45:00',
  },
  {
    id: 'post-3',
    uid: '88392',
    nickname: '健跑達人 Hermann',
    email: 'hermanntalk@gmail.com',
    message: '體能訓練日：核心肌群 + 腿部重訓 60 分鐘，燃燒 450 卡路里，體態持續精進！',
    gps: {
      lat: 25.0330,
      lng: 121.5654,
      locationName: '信義運動中心',
    },
    createdAt: '2026-08-27 20:10:32',
  },
];

export const MyProfilePage: React.FC<MyProfilePageProps> = ({ userEmail }) => {
  // User Profile Info
  const [nickname, setNickname] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_NICKNAME) || '健跑達人 Hermann';
  });
  const [uid] = useState<string>(() => {
    let savedUid = localStorage.getItem(STORAGE_KEY_UID);
    if (!savedUid) {
      savedUid = String(Math.floor(10000 + Math.random() * 90000));
      localStorage.setItem(STORAGE_KEY_UID, savedUid);
    }
    return savedUid.replace(/^UID-/, '');
  });

  const displayEmail = userEmail || 'hermanntalk@gmail.com';

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

  // Current GPS coordinates status
  const [currentGps, setCurrentGps] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsStatus, setGpsStatus] = useState<string>('等待定位');

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCurrentGps({
            lat: Number(pos.coords.latitude.toFixed(4)),
            lng: Number(pos.coords.longitude.toFixed(4)),
          });
          setGpsStatus('GPS 已就緒');
        },
        () => {
          // Fallback location (Taipei)
          setCurrentGps({ lat: 25.0330, lng: 121.5654 });
          setGpsStatus('GPS 座標 (台灣定位)');
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      setCurrentGps({ lat: 25.0330, lng: 121.5654 });
      setGpsStatus('GPS 座標 (預設)');
    }
  }, []);

  const handleSaveNickname = (newNick: string) => {
    setNickname(newNick);
    localStorage.setItem(STORAGE_KEY_NICKNAME, newNick);
  };

  const handleCheckInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);

    // Get current time formatted as YYYY-MM-DD HH:mm:ss
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const timeStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(
      now.getHours()
    )}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

    // Get GPS coords (using current coords or fallback)
    const activeLat = currentGps ? currentGps.lat : 25.0330;
    const activeLng = currentGps ? currentGps.lng : 121.5654;

    const newPost: CheckInPost = {
      id: `post-${Date.now()}`,
      uid,
      nickname,
      email: displayEmail,
      message: message.trim(),
      gps: {
        lat: activeLat,
        lng: activeLng,
        locationName: '運動打卡據點',
      },
      createdAt: timeStr,
    };

    // Prepend new post, keep maximum of 10 posts
    const updatedPosts = [newPost, ...posts.filter((p) => p.id !== newPost.id)].slice(0, 10);
    setPosts(updatedPosts);
    setLatestCheckIn(newPost);
    localStorage.setItem(STORAGE_KEY_CHECKINS, JSON.stringify(updatedPosts));

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

      {/* (B) 運動打卡與留言區 - 深色底色 */}
      <div className="bg-slate-900 border border-slate-800 text-white p-5 rounded-2xl shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-lime-500/20 text-lime-400">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">運動打卡與留言區</h2>
              <p className="text-[10px] text-slate-400">寫下今日運動心得與座標定位打卡</p>
            </div>
          </div>

          {currentGps && (
            <div className="flex items-center gap-1 bg-slate-800/90 px-2.5 py-1 rounded-full border border-slate-700 text-[10px] text-lime-300 font-mono">
              <Navigation className="w-3 h-3 text-lime-400 animate-pulse" />
              {currentGps.lat}, {currentGps.lng}
            </div>
          )}
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
            <span className="text-white font-bold">打卡並儲存</span>
          </button>
        </form>

        {/* 即時打卡資訊結果呈現 (按下後取得 UID, GPS, 留言, 時間) */}
        {latestCheckIn && (
          <div className="p-3.5 bg-slate-800/95 border border-lime-500/40 rounded-xl space-y-2 animate-fadeIn">
            <div className="flex items-center justify-between text-xs pb-1.5 border-b border-slate-700/80">
              <span className="font-bold text-lime-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 打卡成功！最新資訊已取得
              </span>
              <span className="font-mono text-[10px] text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-500" />
                {latestCheckIn.createdAt}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[9px]">用戶 UID</span>
                <span className="font-mono font-bold text-white">{latestCheckIn.uid}</span>
              </div>
              <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[9px]">GPS 座標</span>
                <span className="font-mono font-bold text-lime-300">
                  {latestCheckIn.gps.lat}, {latestCheckIn.gps.lng}
                </span>
              </div>
            </div>

            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[9px] mb-0.5">打卡留言</span>
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

                {/* GPS Location Footer */}
                <div className="pl-8 flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-700/50">
                  <span className="flex items-center gap-1 text-lime-400 font-mono">
                    <MapPin className="w-3 h-3 text-lime-400" />
                    GPS: {post.gps.lat}, {post.gps.lng}
                  </span>

                  {post.gps.locationName && (
                    <span className="text-slate-400">{post.gps.locationName}</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
