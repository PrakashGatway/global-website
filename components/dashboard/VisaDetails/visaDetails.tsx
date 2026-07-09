"use client";

export default function VisaDetails() {

    const visaCards = [
        {
            id: 1,
            name: "Abhiram Vovvaldas",
            country: "France",
            visa: "France Study Visa",
            flag: "https://flagcdn.com/w80/fr.png",
            image: "/visa1.webp",
        },
        {
            id: 2,
            name: "Venkatapathi Atluri",
            country: "Germany",
            visa: "Germany Study Visa",
            flag: "https://flagcdn.com/w80/de.png",
            image: "/visa2.webp",
        },
        {
            id: 3,
            name: "Gauri Sinha",
            country: "Dubai",
            visa: "Dubai Study Visa",
            flag: "https://flagcdn.com/w80/ae.png",
            image: "/visa3.webp",
        },
        {
            id: 4,
            name: "Krishna Bhatia",
            country: "Ireland",
            visa: "Ireland Study Visa",
            flag: "https://flagcdn.com/w80/ie.png",
            image: "/visa4.webp",
        },
    ];

    return (
        <>
            <section className="py-5">
                <div className="max-w-7xl mx-auto px-4 md:px-0">
                    <div className="text-left py-5">
                        <h2 className="text-primary lg:text-4xl font-light">
                            Our Student
                            {" "}
                          <br />  <span className="text-[#F26B3A] font-bold">
                                Visa Approvals
                            </span>
                        </h2>
                        <p className="mt-2 text-lg text-gray-700">
                            Real Students. Real Visas. Real Success Stories.
                        </p>
                    </div>
                </div>

                <div className="bg-[#faf5f2] w-full p-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ">
                            {visaCards.map((item) => (
                                <div
                                    key={item.id}
                                    className="group relative overflow-hidden bg-white border border-gray-200 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                                >
                                    <div className="relative p-1.5">
                                        <div className="overflow-hidden">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-50 border object-cover transition duration-700 group-hover:scale-105"
                                            />
                                        </div>

                                        {/* Country Flag */}
                                        <div className="absolute bottom-4 left-4">
                                            <div className="bg-white flex border border-orange-600 items-center justify-center rounded-full shadow-lg">
                                                <img
                                                    src={item.flag}
                                                    alt={item.country}
                                                    className="w-8 h-8 border border-orange-600 rounded-full object-cover"
                                                /> 
                                                <p className="text-sm px-2 font-semibold text-gray-600 ">
                                                {item.country}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="px-4 pb-6 pt-3">

                                        <h3 className="text-lg font-semibold text-primary group-hover:text-[#F26B3A] transition">
                                            {item.name}
                                        </h3>

                                        <p className="mt-1 text-base text-gray-600">
                                            {item.visa}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </section>
        </>
    )
}


