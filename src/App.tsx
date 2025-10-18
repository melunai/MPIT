import "./index.css";
import Orders from "./pages/Orders";

export default function App() {
  return (
    <div className="h-full w-full flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      <header className="flex-none h-14 flex items-center justify-center border-b border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/70 backdrop-blur">
        <div className="font-semibold text-lg">
          Drivee • Assistant
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-4">
        <Orders />
      </main>

      <footer className="flex-none h-16 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center justify-center">
        <button
          className="w-[90%] py-3 rounded-xl font-semibold text-white text-sm"
          style={{ background: "var(--accent-600)" }}
        >
          Отправить бид
        </button>
      </footer>
    </div>
  );
}
