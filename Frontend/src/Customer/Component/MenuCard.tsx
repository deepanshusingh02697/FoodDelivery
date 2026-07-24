import type { menuCard_Interface } from "../../graphql/Client";

interface Props {
  menu: menuCard_Interface;
  quantity: number;
  onAdd: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
}

export default function MenuCard({
  menu,
  quantity,
  onAdd,
  onIncrease,
  onDecrease,
}: Props) {
  return (
    <div className="bg-[#1d1816] rounded-2xl p-5 flex justify-between border border-transparent hover:border-red-500 transition">
      <div className="flex-1">
        <div className="flex gap-2 items-center">
          {menu.isVeg ? (
            <div className="flex h-4 w-4 items-center justify-center bg-green-600">
            </div>
          ) : (
            <div className="flex h-4 w-4 items-center justify-center bg-red-600">
            
            </div>
          )}

          <h2 className="font-bold text-xl">{menu.name}</h2>
        </div>

        <p className="text-gray-400 mt-2">{menu.description}</p>

        <h2 className="font-bold text-xl mt-4">₹{menu.price}</h2>
      </div>

      <div className="w-40">
        <img
          src={menu.imageUrl}
          alt={menu.name}
          className="w-full h-28 rounded-lg object-cover"
        />

        {quantity === 0 ? (
          <button
            onClick={onAdd}
            className="mt-3 w-full border border-red-500 text-red-500 rounded-lg py-2 hover:bg-red-500 hover:text-white"
          >
            ADD
          </button>
        ) : (
          <div className="mt-3 flex justify-between items-center bg-red-500 rounded-lg px-4 py-2">
            <button onClick={onDecrease}>-</button>

            <span>{quantity}</span>

            <button onClick={onIncrease}>+</button>
          </div>
        )}
      </div>
    </div>
  );
}
