import WBCJudgeCoach from '@/components/WBCJudgeCoach';

export const metadata = {
  title: 'מאמן שופטי תחרות WBC | The Digital Roast',
  description: 'סימולטור שפיטה רשמי לפי תקן תחרות הבריסטה העולמית (WBC 100-Point Judge Scorecard).',
};

export default function WBCJudgePage() {
  return (
    <main className="min-h-screen bg-[#050404] py-12 px-4 sm:px-6 lg:px-8">
      <WBCJudgeCoach />
    </main>
  );
}
