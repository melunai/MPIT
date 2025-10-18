export default function OrderInfo({
  fromText,
  toText,
  price
}: { fromText: string; toText: string; price: number }) {
  return (
    <div className="rounded-[16px] border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-3">
      <div className="text-center text-[18px] font-semibold mb-2">Заказ</div>

      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-neutral-500">👤</div>

        <div className="flex-1 min-w-0">
          <div className="text-sm">
            <span className="text-blue-600 font-semibold">A </span>{fromText}
          </div>
          <div className="text-sm mt-1">
            <span className="text-green-600 font-semibold">B </span>{toText}
          </div>

          <div className="mt-2 text-[18px] font-semibold" style={{color:"#ef4444"}}>
            {price} ₽
          </div>

          <div>
            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-neutral-200/70 dark:bg-neutral-800/70 text-xs text-neutral-700 dark:text-neutral-300">
              Перевод
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
