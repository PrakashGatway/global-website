import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#fffaf7]">
      <div className="relative flex items-center justify-center">

        {/* ROTATING CIRCLE LINE */}
        <div className="absolute w-40 h-40 rounded-full border-[3px] border-black border-t-[#f46c44] animate-spin" />

        {/* LOGO */}
        <Image
          src="/images/loader.png"   // 👈 your logo
          alt="Loading"
          width={180}
          height={80}
          className="relative z-10"
          priority
        />
      </div>
    </div>
  );
}
