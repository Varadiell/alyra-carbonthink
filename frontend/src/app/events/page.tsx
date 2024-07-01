'use client';

import { DataContext } from '@/contexts/data-provider';
import { useContext } from 'react';

export default function Events() {
  const {
    data: { eventLogs },
  } = useContext(DataContext);

  return (
    <>
      <h1>Events</h1>
      <div>TODO: use event logs to display the last events</div>
      {eventLogs?.map((log, index) => (
        <div key={index}>
          <div>Address {log.address}</div>
          <div>Block hash {log.blockHash}</div>
          <div>Block number {log.blockNumber}</div>
          <div>Log index {log.logIndex}</div>
          <div>Transaction hash {log.transactionHash}</div>
          <div>Transaction index {log.transactionIndex}</div>
          <div>Event name {log.eventName}</div>
          <div>Voter {String(log.args['voter'])}</div>
          <div>Proposal {Number(log.args['proposal'])}</div>
        </div>
      ))}
    </>
  );
}
