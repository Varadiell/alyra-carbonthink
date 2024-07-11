import { CircleGauge, HandCoins, SearchCheck, ShieldIcon, Leaf } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <img className="block lg:hidden h-80 w-80 self-center" src="/images/carbonthink_main_logo.png" />
      <section className="w-full p-0 mt-0 md:py-12 lg:py-24">
        <div className="container">
          <img className="hidden lg:block float-right h-60 w-60" src="/images/carbonthink_main_logo.png" />
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2 text-center lg:text-left">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                The complete platform for your Carbon Credits.
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                With our tokenized Carbon Credits (TCO2), buy, sell, transfer and burn for the planet.
              </p>
            </div>
            <Link
              href="/projects"
              className="lg:max-w-[500px] inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              Browse projects
            </Link>
          </div>
        </div>
      </section>
      <section className="w-full py-16 md:py-24">
        <div className="container px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex flex-col items-center text-center space-y-4">
            <CircleGauge className="w-12 h-12 text-primary" />
            <h3 className="text-xl font-bold">Lightning Fast</h3>
            <p className="text-muted-foreground">
              Using Base, an Ethereum L2, our solution delivers lightning-fast performance, ensuring your transactions
              are seamless and efficient.
            </p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4">
            <ShieldIcon className="w-12 h-12 text-primary" />
            <h3 className="text-xl font-bold">Secure & Reliable</h3>
            <p className="text-muted-foreground">
              With all the benefits of the Blockchain, keep all your Carbon Credit tokens safe and use them as you
              decide.
            </p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4">
            <SearchCheck className="w-12 h-12 text-primary" />
            <h3 className="text-xl font-bold">Searchable & Immutable</h3>
            <p className="text-muted-foreground">
              CarbonThink allows you to verify every detail of any project, and keep track of the provenance of your
              tokens.
            </p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4">
            <HandCoins className="w-12 h-12 text-primary" />
            <h3 className="text-xl font-bold">Yours</h3>
            <p className="text-muted-foreground">
              Your wallet, your tokens. Use NFT marketplaces such as OpenSea or Rarible to buy, sell or exchange your
              tokens.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
