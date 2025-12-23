import { useState } from 'react';
// import imgWelcom from "figma:asset/eee8f1b84060ea8600344b93adac92ad7ab27c6b.png";

interface LoginProps {
  onLogin: (username: string, password: string) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      onLogin(username, password);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Background */}
      <div className="absolute inset-0">
        {/* <img alt="" className="w-full h-full object-cover" src={imgWelcom} /> */}
        <div className="absolute inset-0 bg-[rgba(15,12,12,0.6)]" />
      </div>

      {/* Login Form */}
      <div className="relative z-10 bg-white rounded-[20px] md:rounded-[30px] p-6 md:p-12 w-full max-w-[500px] shadow-2xl">
        <h1 className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic text-[32px] md:text-[48px] text-[#262626] text-center mb-6 md:mb-8">
          Вход в систему
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-['Inter:Regular',sans-serif] font-normal not-italic text-[18px] md:text-[20px] text-[#262626]">
              Логин
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border-2 border-[#a3a3a3] rounded-[15px] px-4 py-3 font-['Inter:Regular',sans-serif] font-normal not-italic text-[16px] md:text-[18px] focus:border-[#6495ed] outline-none transition-colors"
              placeholder="Введите логин"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-['Inter:Regular',sans-serif] font-normal not-italic text-[18px] md:text-[20px] text-[#262626]">
              Пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-2 border-[#a3a3a3] rounded-[15px] px-4 py-3 font-['Inter:Regular',sans-serif] font-normal not-italic text-[16px] md:text-[18px] focus:border-[#6495ed] outline-none transition-colors"
              placeholder="Введите пароль"
            />
          </div>

          <button
            type="submit"
            className="bg-[#6495ed] rounded-[15px] py-3 md:py-4 mt-2 md:mt-4 font-['Inter:Regular',sans-serif] font-normal not-italic text-[20px] md:text-[24px] text-center text-white hover:opacity-90 transition-opacity"
          >
            Войти
          </button>
        </form>

        <div className="mt-4 md:mt-6 p-4 bg-[#f5f5f5] rounded-[15px]">
          <p className="font-['Inter:Regular',sans-serif] font-normal not-italic text-[14px] md:text-[16px] text-[#262626] text-center mb-2">
            Тестовые данные:
          </p>
          <p className="font-['Inter:Regular',sans-serif] font-normal not-italic text-[12px] md:text-[14px] text-[#262626]">
            Пользователь: <span className="text-[#6495ed]">user</span> / <span className="text-[#6495ed]">user</span>
          </p>
          <p className="font-['Inter:Regular',sans-serif] font-normal not-italic text-[12px] md:text-[14px] text-[#262626]">
            Админ: <span className="text-[#6495ed]">admin</span> / <span className="text-[#6495ed]">admin</span>
          </p>
        </div>
      </div>
    </div>
  );
}