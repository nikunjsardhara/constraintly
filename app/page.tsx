import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-black dark:to-zinc-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-black/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="text-2xl font-bold text-zinc-900 dark:text-white">
            Constraintly
          </div>
          <div className="flex gap-4">
            <Button variant="outline" asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 pt-16">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-zinc-900 dark:text-white leading-tight">
              Overcome Creative Blocks with
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                Structured Constraints
              </span>
            </h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Break free from creative paralysis. Constraintly generates random design constraints
              that force originality and rapid idea execution.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button size="lg" asChild>
              <Link href="/auth/signup">Get Started Free</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="#features">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-zinc-900 dark:text-white">
            Powerful Design Tools
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="space-y-3">
              <div className="text-4xl">⏱️</div>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                Time Limits
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Challenge yourself with time-boxed design sessions. Create faster, think sharper.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="space-y-3">
              <div className="text-4xl">🛠️</div>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                Tool Limitations
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Restrict your tool palette. Less is more—embrace constraints to innovate.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="space-y-3">
              <div className="text-4xl">🎨</div>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                Color Restrictions
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Work with limited color palettes. Master the art of intentional design.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="space-y-3">
              <div className="text-4xl">📚</div>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                Asset Restrictions
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Limited assets force you to be creative with what you have.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="space-y-3">
              <div className="text-4xl">📈</div>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                Streak Tracking
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Build momentum with daily streaks. Track your creative growth over time.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="space-y-3">
              <div className="text-4xl">💪</div>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                Full Canvas Editor
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Professional design tools for drawing, shapes, text, and more.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-8 bg-gradient-to-r from-purple-600/10 to-blue-600/10 dark:from-purple-600/5 dark:to-blue-600/5 rounded-2xl p-12 border border-purple-200 dark:border-purple-900/30">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">
            Ready to Break Creative Blocks?
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Join designers who are pushing their creative boundaries with intentional constraints.
          </p>
          <Button size="lg" asChild>
            <Link href="/auth/signup">Start Designing Now</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-5xl mx-auto text-center text-zinc-600 dark:text-zinc-400">
          <p>&copy; 2024 Constraintly. Built for creative designers.</p>
        </div>
      </footer>
    </div>
  );
}

