import React, { useMemo, useState, useEffect } from "react";
import Modal from "./Modal";

export default function CustomPriceModal({
  open,
  basePrice,                 // стартовая цена для подсказок
  onClose,
  onConfirm                  // вызов с валидной ценой
}: {
  open: boolean;
  basePrice: number;
  onClose: () => void;
  onConfirm: (price: number) => void;
}) {
  // политика валидации: 50%..200% от стартовой, шаг 10 ₽
  const min = useMemo(() => Math.max(50, Math.round(basePrice * 0.5)), [basePrice]);
  const max = useMemo(() => Math.round(basePrice * 2.0), [basePrice]);
  const step = 10;

  const [value, setValue] = useState<string>(String(basePrice));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { if (open) { setValue(String(basePrice)); setError(null); } }, [open, basePrice]);

  const validate = (raw: string) => {
    if (!raw.trim()) return "Введите сумму";
    const n = Number(raw);
    if (!Number.isFinite(n)) return "Неверное число";
    if (!Number.isInteger(n)) return "Только целые ₽";
    if (n < min) return `Минимум ${min} ₽`;
    if (n > max) return `Максимум ${max} ₽`;
    if (n % step !== 0) return `Шаг ${step} ₽ (например, ${Math.round(n/step)*step} ₽)`;
    return null;
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value.replace(/[^\d]/g, "");
    setValue(next);
    setError(validate(next));
  };

  const confirm = () => {
    const err = validate(value);
    if (err) { setError(err); return; }
    onConfirm(Number(value));
  };

  return (
    <Modal open={open} onClose={onClose} title="Своя цена">
      <div className="space-y-2">
        <label className="block text-sm text-neutral-600 dark:text-neutral-300">
          Введите сумму от {min} до {max} ₽ (шаг {step} ₽)
        </label>
        <div className="flex items-center gap-2">
          <input
            inputMode="numeric"
            pattern="[0-9]*"
            value={value}
            onChange={onChange}
            placeholder={`${basePrice}`}
            className="flex-1 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-base"
          />
          <button
            className="rounded-xl px-3 py-2 border border-neutral-300 dark:border-neutral-700"
            onClick={()=>setValue(String(basePrice))}
          >
            = {basePrice} ₽
          </button>
        </div>
        {error && <div className="text-sm text-red-600">{error}</div>}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button onClick={onClose} className="btn-ghost">Отмена</button>
        <button
          onClick={confirm}
          className="btn-drivee disabled:opacity-60"
          disabled={!!validate(value)}
        >
          Отправить
        </button>
      </div>
    </Modal>
  );
}
