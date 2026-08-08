import styles from "../styles/cs.module.css";

function Pricing() {
  return (
    <div className="w-full min-h-screen">
      <div className="mx-auto text-center px-10 p-10">
        <div>
          <h1
            className={`lg:text-8xl text-7xl font-extrabold p-4 mt-7 mb-5 ${styles.chrome}`}
          >
            Pricing.
          </h1>
          <p className="text-lg mb-16 text-text-muted">
            Simple pricing. No surprises.
          </p>
        </div>
        <div className="w-full py-10 lg:max-w-310 max-w-130 mx-auto grid lg:grid-cols-2 gap-8">
          {/* Free */}
          <div className="bg-card border border-border text-text-primary rounded-2xl p-8 flex flex-col hover:scale-105 duration-300 hover:border-silver-muted">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-green-primary mb-2">
                Free
              </h2>
              <div className="text-5xl font-extrabold text-silver-primary">
                $0
              </div>
              <p className="text-text-muted text-sm mt-1">forever</p>
            </div>
            <ul className="flex flex-col gap-4 text-left mb-8 flex-1">
              <li className="border-b border-border pb-4 text-sm flex items-center gap-2">
                <span className="text-green-primary">✓</span> Up to 50 items
              </li>
              <li className="border-b border-border pb-4 text-sm flex items-center gap-2">
                <span className="text-green-primary">✓</span> Basic profit
                tracking
              </li>
              <li className="border-b border-border pb-4 text-sm flex items-center gap-2">
                <span className="text-green-primary">✓</span> Add locations
                where you thrift
              </li>
              <li className="pb-4 border-b border-border text-sm flex items-center gap-2">
                <span className="text-green-primary">✓</span> Show profit for
                each sourcing type
              </li>
            </ul>
            <button className="w-full bg-silver-muted text-bg py-3 rounded-xl font-bold hover:bg-silver-primary transition-all">
              Get started free
            </button>
          </div>

          {/* Pro */}
          <div className="bg-green-primary border border-green-hover text-text-primary rounded-2xl p-8 flex flex-col hover:scale-105 duration-300 hover:border-silver-muted">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-text-primary mb-2">Pro</h2>
              <div className="text-5xl font-extrabold text-silver-primary">
                $6.99
                <span className="text-xl font-normal text-text-primary opacity-60">
                  /mo
                </span>
              </div>
              <p className="text-text-primary opacity-60 text-sm mt-1">
                billed monthly
              </p>
            </div>
            <ul className="flex flex-col gap-4 text-left mb-8 flex-1">
              {[
                "Everything in Free",
                "Unlimited items",
                "Show item type/brand with the best profit margin",
                "Receipt scanning",
                "Photo uploads per item",
              ].map((benefit) => (
                <li
                  key={benefit}
                  className="border-b border-green-hover pb-4 text-sm flex items-center gap-2"
                >
                  <span className="text-text-primary">✓</span> {benefit}
                </li>
              ))}
            </ul>
            <button className="w-full bg-bg text-text-primary py-3 rounded-xl font-bold hover:bg-card transition-all">
              Try Pro Free for 7 days
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Pricing;
