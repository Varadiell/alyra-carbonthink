import { DelegateCard } from '@/components/shared/delegate-card';
import { GiveRightToVoteCard } from '@/components/shared/give-right-to-vote-card';

export default function Voters() {
  return (
    <>
      <h1>Voters</h1>
      <GiveRightToVoteCard />
      <DelegateCard />
      <div>TODO: use event logs to display voters that were registered</div>
    </>
  );
}
