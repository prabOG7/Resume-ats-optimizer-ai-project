import ResumeAnalyzer from '../components/ResumeAnalyzer';

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Resume ATS Optimizer</h1>
      <ResumeAnalyzer />
    </main>
  );
}