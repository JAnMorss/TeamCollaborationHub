type Props = {}

export default function CTA({}: Props) {
  return (
    <section className="px-6 py-20 bg-gradient-to-r 
        from-blue-600 to-purple-600 
        dark:from-blue-900 dark:to-purple-900
        shadow-[0_0_80px_rgba(59,130,246,0.15)]"
    >
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-4xl text-white dark:text-white mb-6">
          Ready to transform your team collaboration?
        </h2>
        <p className="text-xl text-blue-100 dark:text-blue-200 mb-8 max-w-2xl mx-auto">
          Join thousands of teams already using TeamHub to work smarter and achieve their goals faster.
        </p>
      </div>
    </section>
  )
}
