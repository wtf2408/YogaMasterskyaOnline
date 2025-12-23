interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  userName?: string;
  isAdmin?: boolean;
  onLogout?: () => void;
}

export function Header({ onNavigate, currentPage, userName, isAdmin, onLogout }: HeaderProps) {
  return (
    <div className="bg-[#262626] h-auto md:h-[60px] w-full flex flex-col md:flex-row items-center justify-between px-4 md:px-8 py-4 md:py-0 gap-4 md:gap-0">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic text-center text-white text-[20px] md:text-[26px] logo">
        <span className="text-[#74c0fc] upper">YOGA</span>
        <span>{` master`}</span>
        <span className="text-[#74c0fc] upper">SKY</span>a
      </p>
      
      {userName && (
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 font-['Inter:Regular',sans-serif] font-normal not-italic text-[16px] md:text-[18px] text-center text-white w-full md:w-auto">
          {!isAdmin && (
            <button 
              onClick={() => onNavigate('courses')}
              className={`h-[30px] w-full md:w-[214px] ${currentPage === 'courses' ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
            >
              КУРСЫ
            </button>
          )}
          
          {isAdmin && (
            <button 
              onClick={() => onNavigate('admin')}
              className={`h-[30px] w-full md:w-[214px] ${currentPage === 'admin' ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
            >
              АДМИН-ПАНЕЛЬ
            </button>
          )}
          
          <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4 w-full md:w-auto">
            <span className="text-[#74c0fc]">{userName}</span>
            <button 
              onClick={onLogout}
              className="bg-[#6495ed] rounded-[10px] px-4 py-2 hover:opacity-80 transition-opacity w-full md:w-auto"
            >
              Выйти
            </button>
          </div>
        </div>
      )}
    </div>
  );
}