import { Redis } from "@upstash/redis";

const redis = (() => {
  try {
    return Redis.fromEnv();
  } catch (error) {
    console.warn("Redis connection error:", error.message);
    return null;
  }
})();

export const revalidate = 60;

export const Stats = asyncComponent(async () => {
  try {
    if (!redis) {
      // Fallback data when Redis is not available
      return (
        <section className="container mx-auto">
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3 ">
            <li className="flex items-center justify-between gap-2 px-4 py-3 overflow-hidden rounded m sm:flex-col">
              <dd className="text-2xl font-bold tracking-tight text-center sm:text-5xl text-zinc-200">-</dd>
              <dt className="leading-6 text-center text-zinc-500">Documents Encrypted</dt>
            </li>
            <li className="flex items-center justify-between gap-2 px-4 py-3 overflow-hidden rounded m sm:flex-col">
              <dd className="text-2xl font-bold tracking-tight text-center sm:text-5xl text-zinc-200">-</dd>
              <dt className="leading-6 text-center text-zinc-500">Documents Decrypted</dt>
            </li>
            <li className="flex items-center justify-between gap-2 px-4 py-3 overflow-hidden rounded m sm:flex-col">
              <dd className="text-2xl font-bold tracking-tight text-center sm:text-5xl text-zinc-200">-</dd>
              <dt className="leading-6 text-center text-zinc-500">GitHub Stars</dt>
            </li>
          </ul>
        </section>
      );
    }

    const [reads, writes] = await redis
      .pipeline()
      .get("envshare:metrics:reads")
      .get("envshare:metrics:writes")
      .exec<[number, number]>();
    
    let stars;
    try {
      stars = await fetch("https://api.github.com/repos/chronark/envshare")
        .then((res) => res.json())
        .then((json) => json.stargazers_count as number);
    } catch (error) {
      console.warn("Failed to fetch GitHub stars:", error);
    }

    const stats = [
      {
        label: "Documents Encrypted",
        value: writes || 0,
      },
      {
        label: "Documents Decrypted",
        value: reads || 0,
      },
    ] satisfies { label: string; value: number }[];

    if (stars) {
      stats.push({
        label: "GitHub Stars",
        value: stars,
      });
    }

    return (
      <section className="container mx-auto">
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3 ">
          {stats.map(({ label, value }) => (
            <li
              key={label}
              className="flex items-center justify-between gap-2 px-4 py-3 overflow-hidden rounded m sm:flex-col"
            >
              <dd className="text-2xl font-bold tracking-tight text-center sm:text-5xl text-zinc-200">
                {Intl.NumberFormat("en-US", { notation: "compact" }).format(value)}
              </dd>
              <dt className="leading-6 text-center text-zinc-500">{label}</dt>
            </li>
          ))}
        </ul>
      </section>
    );
  } catch (error) {
    console.error("Error rendering Stats component:", error);
    return (
      <section className="container mx-auto">
        <div className="text-center text-zinc-500">
          Could not load statistics
        </div>
      </section>
    );
  }
});

// stupid hack to make "server components" actually work with components
// https://www.youtube.com/watch?v=h_9Vx6kio2s
function asyncComponent<T, R>(fn: (arg: T) => Promise<R>): (arg: T) => R {
  return fn as (arg: T) => R;
}