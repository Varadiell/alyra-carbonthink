'use client';

import { Breadcrumbs } from '@/components/shared/breadcrumbs';
import { EventsList } from '@/components/shared/events-list';
import { DataContext } from '@/contexts/data-provider';
import { useContext } from 'react';
import { zeroAddress } from 'viem';
import Link from 'next/link';

export default function Marketplace() {
  const {
    contracts: { tco2Contract },
    data: { tco2EventLogs },
  } = useContext(DataContext);

  if (!tco2Contract?.address) {
    return null;
  }

  return (
    <>
      <Breadcrumbs layers={['Home', 'Marketplace']} />
      <div className="text-2xl font-semibold leading-none tracking-tight">Get your TCO2 tokens!</div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Link
          href={`https://testnets.opensea.io/fr/assets/base-sepolia/${tco2Contract?.address}/`}
          className="group relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl"
          prefetch={false}
          target="_blank"
        >
          <img
            src="/images/opensea.webp"
            alt="Link 1"
            width={600}
            height={400}
            className="h-[400px] w-full object-cover transition-all duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-black/40" />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white">
            <h3 className="text-5xl font-bold tracking-tight transition-all duration-300 group-hover:translate-y-4">
              OpenSea
            </h3>
            <p className="mt-4 max-w-[300px] text-sm opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              Buy, sell & trade TCO2 tokens with OpenSea.
            </p>
          </div>
        </Link>
        <Link
          href={`https://testnet.rarible.com/collection/base/${tco2Contract?.address}/items`}
          className="group relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl"
          prefetch={false}
          target="_blank"
        >
          <img
            src="/images/rarible.webp"
            alt="Link 2"
            width={600}
            height={400}
            className="h-[400px] w-full object-cover transition-all duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-black/40" />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white">
            <h3 className="text-5xl font-bold tracking-tight transition-all duration-300 group-hover:translate-y-4">
              Rarible
            </h3>
            <p className="mt-4 max-w-[300px] text-sm opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              Buy, sell & trade TCO2 tokens with Rarible.
            </p>
          </div>
        </Link>
      </div>
      <EventsList
        title="Latests exchanges"
        eventLogs={tco2EventLogs
          ?.filter(
            (event) =>
              event.eventName === 'TransferSingle' && event.args.from !== zeroAddress && event.args.to !== zeroAddress,
          )
          .slice(0, 5)}
      />
    </>
  );
}
