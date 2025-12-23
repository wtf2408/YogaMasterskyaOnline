// import imgIcons8TelegramApp481 from "figma:asset/9c72e0a087d016b9cf6c2d76bc4d71386625ffd6.png";
// import imgIcons8Whatsapp481 from "figma:asset/52ac6edcfed6d6719a25e3c7908028777f812eec.png";
// import imgIcons8Instagram241 from "figma:asset/7fadcb7a43e5a13125403fe5f6cca78da1e35fbc.png";

export function Footer() {
  return (
    <div className="bg-[#262626] w-full py-8 md:py-12 px-4 md:px-8 mt-auto">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {/* Контакты */}
        <div className="flex flex-col items-center gap-3 md:gap-4">
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic text-[24px] md:text-[35px] text-center text-white">
            Контакты
          </p>
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic text-[16px] md:text-[20px] text-center text-white">
            Отвечаем ежедневно с 10:00 до 21:00
          </p>
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic opacity-80 text-[16px] md:text-[20px] text-center text-white">
            8 (928) 821-75-14
          </p>
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic text-[16px] md:text-[20px] text-center text-white">
            Пятигорск, ул. Московская 78, к1
          </p>
        </div>

        {/* Социальные сети */}
        <div className="flex flex-col items-center gap-3 md:gap-4">
          <div className="flex gap-4 md:gap-6 justify-center">
            <div className="size-[45px] md:size-[53px] cursor-pointer hover:opacity-80 transition-opacity">
              {/* <img alt="Instagram" className="w-full h-full object-cover" src={imgIcons8Instagram241} /> */}
            </div>
            <div className="size-[45px] md:size-[53px] cursor-pointer hover:opacity-80 transition-opacity">
              {/* <img alt="Telegram" className="w-full h-full object-cover" src={imgIcons8TelegramApp481} /> */}
            </div>
            <div className="size-[45px] md:size-[53px] cursor-pointer hover:opacity-80 transition-opacity">
              {/* <img alt="WhatsApp" className="w-full h-full object-cover" src={imgIcons8Whatsapp481} /> */}
            </div>
          </div>
        </div>

        {/* Навигация */}
        <div className="flex flex-col items-center gap-3 md:gap-4">
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic text-[24px] md:text-[35px] text-center text-white">
            Навигация
          </p>
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic text-[16px] md:text-[20px] text-center text-white">
            КУРСЫ
          </p>
        </div>
      </div>
      
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic text-[14px] md:text-[20px] text-center text-white mt-6 md:mt-8">
        Ссылка на политику конфиденциальности сайта
      </p>
    </div>
  );
}