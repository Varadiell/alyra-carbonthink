import { ProposalsList } from '@/components/shared/proposals-list';

export default function Proposals() {
  return (
    <>
      <h1>Proposals</h1>
      <ProposalsList displayVotes={false} />
    </>
  );
}
