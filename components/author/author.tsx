import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, ArrowRight } from "lucide-react";

interface AuthorCardProps {
    name: string;
    designation: string;
    image: string;
    bio: string;
    profile?: string;
}

export default function AuthorCard({
    name,
    designation,
    image,
    bio,
    profile = "/authors/sakshi-taneja",
}: AuthorCardProps) {
    return (
        <section className="my-4 border bg-white p-6 transition-all hover:shadow-md">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                {/* Image */}
                <div className="relative h-18 w-18 mt-6 shrink-0 overflow-hidden rounded-full border-4 border-[#F4C542]/30">
                    <Image
                        src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcxSIkbDpRi11M201gRDRamK_4nK4D1rGbeGT3LUJM3g&s=10"}
                        alt={name}
                        fill
                        className="object-cover p-4"
                    />
                </div>

                {/* Content */}

                <div className="flex-1">
                    <span className="flex-inline items-center mb-6 rounded-full bg-[#EE6A43]/80 px-3 py-1.5 text-xs font-semibold text-white">
                        Author
                    </span>
                    <Link className="" href={"/author/sakshi-taneja"}>
                        <h3 className=" mb-1 mt-1 cursor-pointer flex items-center gap-1 text-2xl font-bold text-[#0F2B5B]">
                            {name}<span className="flex items-center gap-1 rounded-full bg-[#F4C542]/15 px-3 py-2 text-xs font-semibold text-[#B88700]">
                                <BadgeCheck size={14} />
                                Verified Expert
                            </span>
                        </h3>
                    </Link>

                    <p className="font-medium text-[#C89B1C]">
                        {designation}
                    </p>

                    <p className="mt-2 line-clamp-3 text-[15px] font-medium text-slate-600">
                        {bio}
                    </p>
                </div>
            </div>
        </section>
    );
}