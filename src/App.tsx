import { useState, useCallback, useEffect } from "react";
import "./index.css";
import Orders from "./pages/Orders";
import MapInteractive from "./components/MapInteractive";

export default function App() {
  const from = { lat: 62.028, lon: 129.734 };
  const to   = { lat: 62.042, lon: 129.720 };

  const [open, setOpen] = useState(false);
  const [hasOrder, setHasOrder] = useState(true);

  const openSheet  = useCallback(() => hasOrder && setOpen(true), [hasOrder]);
  const closeSheet = useCallback(() => setOpen(false), []);
  const toggle     = useCallback(() => setOpen(v => !v), []);

  useEffect(() => {
    document.body.classList.toggle("scroll-lock", open);
    return () => document.body.classList.remove("scroll-lock");
  }, [open]);

  const handleDeclineOrder = useCallback(() => {
    setOpen(false);
    setHasOrder(false); // заказ пропадает
  }, []);

  return (
    <div className="h-full w-full relative isolate bg-[color:var(--drivee-bg)] text-neutral-900">
      {/* Контейнер для модалок ВНУТРИ приложения (портал сюда) */}
      <div id="modal-root" className="absolute inset-0 z-[80] pointer-events-none" />

      {/* КАРТА */}
      <div className="absolute inset-0 z-0" id="map-layer">
        <MapInteractive from={from} to={to} height={window.innerHeight} />
      </div>

      {/* Пилюля */}
      {hasOrder && (
        <div className="pointer-events-none absolute left-1/2 top-5 -translate-x-1/2 z-40">
          <div className="top-pill">Новый заказ</div>
        </div>
      )}

      {/* FAB открыть */}
      {!open && hasOrder && (
        <div className="fab-open px-4 w-full max-w-md">
          <button className="btn-drivee w-full" onClick={openSheet}>Открыть заказ</button>
        </div>
      )}

      {/* ШТОРКА */}
      {hasOrder && (
        <div className={`sheet ${open ? "sheet--open" : "sheet--hidden"}`} aria-hidden={!open}>
          <div className="sheet-card relative">
            {/* кнопка «Скрыть» — чуть выше кромки */}
            <button className="sheet-hide-btn" onClick={closeSheet}>Скрыть</button>

            {/* ручка */}
            <div className="sheet-handle" onClick={toggle}>
              <div className="sheet-handle-dot" />
            </div>

            {/* скроллируемая область контента */}
            <div className="sheet-scroll">
              <div className="text-center text-lg font-semibold mb-3">Заказ</div>
              <Orders onDecline={handleDeclineOrder} />
            </div>

            {/* ЛИПКИЙ ФУТЕР С КНОПКАМИ — всегда влезает */}
            <div className="sheet-actions">
              {/* Кнопок здесь нет, они теперь в Orders — но если захочешь, можно перенести сюда */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
