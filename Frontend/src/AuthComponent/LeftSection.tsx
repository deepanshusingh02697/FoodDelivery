import { FaUtensils } from "react-icons/fa6";

export default function LeftSection() {
  return (
    <div className="hidden lg:flex relative overflow-hidden">
        <img
          src="https://res.cloudinary.com/delubzbh2/image/upload/v1785167622/FoodDelivery/k36anwftg4vt2zmzuwh4.avif"
          className="absolute w-full h-full object-cover"
          alt="food"
        />
        <div className="relative z-10 flex flex-col justify-end p-12 pb-20">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-red-500 p-3 rounded-xl">
              <FaUtensils size={28} />
            </div>
            <h1 className="text-3xl font-bold">
              Zomato<span className="text-red-500">.</span>
            </h1>
          </div>
          <h2 className="text-6xl font-extrabold leading-tight">
            Food that
            <br />
            <span className="text-orange-500">fuels</span> every
            <br />
            moment.
          </h2>
          <p className="mt-8 text-gray-200 text-lg max-w-md leading-relaxed">
            2,400+ restaurants. Real-time tracking. Delivered in under 35
            minutes.
          </p>
        </div>
      </div>
  )
}
