import { useMemo, useState } from "react";
import MapCard from "../components/MapCard";
import OrderInfo from "../components/OrderInfo";
import Spinner from "../components/Spinner";
import { proposeOptions } from "../domain/mock";
import type{ Order, BidOption } from "../domain/types";
import { BID_LABELS } from "../domain/types";
import { sendBid } from "../domain/api";

export default function Orders() {
  const order: Order = useMemo(()=>({
    id: "A-123",
    priceStart: 300,
    distanceM: 4200,
    pickupM: 331,
    userRating: 4.9
  }), []);

  const options = proposeOptions(order);
  const [selected, setSelected] = useState<BidOption | null>(null);

  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<null | { ok: boolean; bidId?: string }>(null);

  const chosenText = selected
    ? `Выбрано: «${selected.label}» — ${selected.price} ₽ (шанс ${Math.round(selected.pAccept*100)}%)`
    : `Выбрано: стартовая цена — ${order.priceStart} ₽`;

  const handleAccept = async (price: number) => {
    setResult(null);
    setSending(true);
    try {
      const r = await sendBid({ orderId: order.id, price });
      setResult(r);
    } finally {
      setSending(false);
    }
  };

  const chipColor = (label: BidOption["label"]) => {
    if (label === BID_LABELS[0]) return "green";   
    if (label === BID_LABELS[1]) return "blue";    
    return "orange";                                
  };

  return (
    <div className="space-y-3">
      <MapCard
        provider="osm"
        from={{ lat: 62.028, lon: 129.734 }}
        to={{ lat: 62.042, lon: 129.720 }}
      />

      <OrderInfo
        from="Дом дружбы народов имени А.Е. Кулаковского (улица Пояркова, 4 / улица Дзержинского, 13, Якутск)"
        to="улица Бекетова, 9а (Сайсарский округ, Якутск)"
        price={order.priceStart}
      />

      {/* ПЕРЕНЕСЛИ выбранный вариант ВЫШЕ — прямо над кнопкой */}
      <div className="text-center text-xs text-neutral-700 dark:text-neutral-300">
        {chosenText}
      </div>

      {/* большая зелёная кнопка — отправляет либо выбранный бид, либо стартовую цену */}
      <button
        className="btn-drivee disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        disabled={sending}
        onClick={()=>handleAccept(selected?.price ?? order.priceStart)}
      >
        {sending ? (
          <>
            <Spinner /> Ожидание подтверждения…
          </>
        ) : (
          <>Принять за {(selected?.price ?? order.priceStart)} ₽</>
        )}
      </button>

      {/* подпись как на макете */}
      <div className="text-center text-xs text-neutral-500">Предложите свою цену:</div>

      {/* разноцветные чипы */}
      <div className="flex items-center justify-center gap-2">
        {options.map(opt => {
          const active = selected?.label === opt.label;
          return (
            <button
              key={opt.label}
              className={`price-chip ${chipColor(opt.label)} ${active ? "active" : ""}`}
              onClick={()=>setSelected(opt)}
              aria-label={`Предложить ${opt.price} ₽`}
              title={`Шанс: ${Math.round(opt.pAccept*100)}% • Ожид.доход: ${Math.round(opt.expectedIncome)} ₽`}
            >
              {opt.price} ₽
            </button>
          );
        })}
        {/* пользовательская цена — пока заглушка */}
        <button className="price-chip" title="Другая цена…">✎</button>
      </div>

      {/* кнопка «Закрыть» */}
      <button className="btn-ghost">Закрыть</button>

      {/* результат имитации */}
      {result && (
        <div className={`text-center text-sm ${result.ok ? "text-green-600" : "text-red-600"}`}>
          {result.ok ? `✅ Бид отправлен (ID: ${result.bidId})` : "❌ Не удалось отправить. Попробуйте ещё раз."}
        </div>
      )}
    </div>
  );
}
