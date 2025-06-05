import Link from "next/link";
import { Stats } from "./components/stats";

export default function Home() {
  return (
    <div className="flex flex-col gap-8 pb-8 md:gap-16 md:pb-16 xl:pb-24">
      <div className="flex flex-col items-center justify-center max-w-3xl px-8 mx-auto mt-8 sm:min-h-screen sm:mt-0 sm:px-0">
        <div className="hidden sm:mb-8 sm:flex sm:justify-center">
          <div
            className="text-zinc-400 relative overflow-hidden rounded-full py-1.5 px-4 text-sm leading-6 ring-1 ring-burnt-orange-500/30 hover:ring-burnt-orange-500/60 duration-150"
          >
            A Blind Vibe Tool
          </div>
        </div>
        <div>
          <h1 className="py-4 text-5xl font-bold tracking-tight text-center text-transparent bg-gradient-to-t bg-clip-text from-burnt-orange-400 to-burnt-orange-200 sm:text-7xl">
            Share Environment Variables Securely
          </h1>
          <p className="mt-6 leading-5 text-zinc-600 sm:text-center">
            Your document is encrypted in your browser before being stored for a limited period of time and read
            operations. Unencrypted data never leaves your browser.
          </p>
          <div className="flex flex-col justify-center gap-4 mx-auto mt-8 sm:flex-row sm:max-w-lg">
            <Link
              href="/share"
              className="sm:w-1/2 sm:text-center inline-block transition-all space-x-2 rounded px-4 py-1.5 md:py-2 text-base font-semibold leading-7 text-zinc-100 bg-burnt-orange-500 ring-1 ring-burnt-orange-500 hover:bg-burnt-orange-600 hover:ring-burnt-orange-600 duration-150 hover:drop-shadow-orange"
            >
              <span>Share</span>
              <span aria-hidden="true">&rarr;</span>
            </Link>
            <Link
              href="/dashboard"
              className="sm:w-1/2 sm:text-center inline-block transition-all space-x-2 rounded px-4 py-1.5 md:py-2 text-base font-semibold leading-7 text-zinc-100 border border-burnt-orange-500 hover:bg-burnt-orange-500/20 duration-150"
            >
              <span>Team Vault</span>
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
      <h2 className="py-4 text-3xl font-bold text-center text-zinc-300">Secure & Private by Design</h2>
      <Stats />
    </div>
  );
}