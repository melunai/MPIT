import { useMemo, useState } from "react";
import MapInteractive from "../components/MapInteractive";
import OrderInfo from "../components/OrderInfo";
import Spinner from "../components/Spinner";
import CustomPriceModal from "../components/CustomPriceModal";
import { proposeOptions } from "../domain/mock";
import type{ Order, BidOption } from "../domain/types";
import { BID_LABELS } from "../domain/types";
import { sendBid } from "../domain/api";
import { useNearestRoad } from "../hooks/useOverpass";

export default function Orders() {
  // Координаты (пример — Якутск)
  const from = { lat: 62.028, lon: 129.734 };
  const to   = { lat: 62.042, lon: 129.720 };

  const { road: fromRoad } = useNearestRoad(from.lat, from.lon);
  const { road: toRoad }   = useNearestRoad(to.lat, to.lon);

  const order: Order = useMemo(()=>({
    id: "A-123",
    priceStart: 300,
    distanceM: 4200,
    pickupM: 331,
    userRating: 4.9
  }), []);

  const options = proposeOptions(order);

  // выбранная опция
  const [selected, setSelected] = useState<BidOption | null>(null);

  // отправка бида
  const [sending, setSending] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>("Выбрано: стартовая цена — 300 ₽");
  const [result, setResult] = useState<null | { ok: boolean; bidId?: string }>(null);

  // модалка своей цены
  const [customOpen, setCustomOpen] = useState(false);

  const chipColor = (label: BidOption["label"]) => {
    if (label === BID_LABELS[0]) return "green";   // Надёжный
    if (label === BID_LABELS[1]) return "blue";    // Оптимальный
    return "orange";                               // Смелый
  };

  const onPickChip = (opt: BidOption) => {
    setSelected(opt);
    setLastMessage(`Выбрано: «${opt.label}» — ${opt.price} ₽ (шанс ${Math.round(opt.pAccept*100)}%)`);
    setResult(null);
  };

  const onConfirmCustom = async (price: number) => {
    setCustomOpen(false);
    setSelected(null);
    await doSend(price);
  };

  async function doSend(price: number) {
    setSending(true);
    setResult(null);
    setLastMessage(`Отправка бида на ${price} ₽…`);
    try {
      const r = await sendBid({ orderId: order.id, price });
      setResult(r);
      setLastMessage(r.ok ? `✅ Бид отправлен: ${price} ₽ (ID: ${r.bidId})` : `❌ Не удалось отправить бид: ${price} ₽`);
    } finally {
      setSending(false);
    }
  }

  const onSendBid = () => {
    const price = selected?.price ?? order.priceStart;
    return doSend(price);
  };

  return (
    <div className="space-y-3">
      {/* Интерактивная карта */}
      <MapInteractive from={from} to={to} />

      <OrderInfo
        fromText={fromRoad ? `ул. ${fromRoad}` : "Точка A — улица определяется…"}
        toText={toRoad ? `ул. ${toRoad}` : "Точка B — улица определяется…"}
        price={order.priceStart}
      />

      {/* сообщение — ВЫШЕ кнопки */}
      <div className="text-center text-xs text-neutral-700 dark:text-neutral-300 min-h-[20px]">
        {lastMessage}
      </div>

      {/* КНОПКА ОТПРАВКИ БИДА */}
      <button
        className="btn-drivee disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        onClick={onSendBid}
        disabled={sending}
      >
        {sending ? (<><Spinner /> Ожидание подтверждения…</>) : (<>Отправить бид</>)}
      </button>

      <div className="text-center text-xs text-neutral-500">Предложите свою цену:</div>

      {/* ЧИПЫ — ТОЛЬКО ВЫБОР */}
      <div className="flex items-center justify-center gap-2">
        {options.map(opt => {
          const active = selected?.label === opt.label;
          return (
            <button
              key={opt.label}
              className={`price-chip ${chipColor(opt.label)} ${active ? "active" : ""}`}
              onClick={()=>onPickChip(opt)}
              disabled={sending}
              aria-label={`Выбрать ${opt.price} ₽`}
              title={`Шанс: ${Math.round(opt.pAccept*100)}% • Ожид.доход: ${Math.round(opt.expectedIncome)} ₽`}
            >
              {opt.price} ₽
            </button>
          );
        })}
        <button className="price-chip" title="Другая цена…" onClick={()=>setCustomOpen(true)}>✎</button>
      </div>

      <button className="btn-ghost">Закрыть</button>

      {result && (
        <div className={`text-center text-sm ${result.ok ? "text-green-600" : "text-red-600"}`}>
          {result.ok ? "Подтверждено системой" : "Нет подтверждения. Повторите попытку."}
        </div>
      )}

      {/* Модалка своей цены */}
      <CustomPriceModal
        open={customOpen}
        basePrice={order.priceStart}
        onClose={()=>setCustomOpen(false)}
        onConfirm={onConfirmCustom}
      />
    </div>
  );
}
