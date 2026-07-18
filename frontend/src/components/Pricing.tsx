import styles from "../styles/cs.module.css";

function Pricing() {
  return (
    <div className="w-full min-h-screen">
      <div className="mx-auto text-center px-10 p-10">
        <div>
          <h1
            className={`lg:text-8xl text-7xl  font-extrabold p-4 mt-7 mb-5 ${styles.chrome}`}
          >
            {" "}
            Pricing.{" "}
          </h1>
          <p className={` text-lg mb-16 text-white`}>
            Simple pricing. No surprises.
          </p>
        </div>
        <div className="w-full py-10 lg:max-w-310 max-w-130 mx-auto grid lg:grid-cols-2 gap-8">
          {/* Free */}
          <div className="bg-[#2a2c2a] border border-[#6a6a6a] text-[#d4e8b0] rounded-2xl p-8 flex flex-col hover:scale-105 duration-300 hover:border-[#a0a0a0]">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-[#8aaa62] mb-2">Free</h2>
              <div className="text-5xl font-extrabold text-[#a0a0a0]">$0</div>
              <p className="text-[#5a6e4a] text-sm mt-1">forever</p>
            </div>

            {/* list of benifits*/}
            <ul className="flex flex-col gap-4 text-left mb-8 flex-1">
              <li className="border-b border-[#5a5959] pb-4 text-sm flex items-center gap-2">
                <span className="text-[#6b8c4a]">✓</span> Up to 50 items
              </li>
              <li className="border-b border-[#5a5959] pb-4 text-sm flex items-center gap-2">
                <span className="text-[#6b8c4a]">✓</span> Basic profit tracking
              </li>
              <li className="border-b border-[#5a5959] pb-4 text-sm flex items-center gap-2">
                <span className="text-[#6b8c4a]">✓</span> Add locations where
                you thrift
              </li>
              <li className="pb-4 border-b border-[#5a5959] text-sm flex items-center gap-2">
                <span className="text-[#6b8c4a]">✓</span> Show profit for each
                sourcing type
              </li>
            </ul>
            <button className="w-full bg-[#8e8f8e] text-[#242724] py-3 rounded-xl font-bold hover:bg-[#bdbdbd] transition-all">
              Get started free
            </button>
          </div>
          {/* Pro */}

          <div className="bg-[#1a441a] border border-[#396329] text-[#d4e8b0] rounded-2xl p-8 flex flex-col hover:scale-105 duration-300 hover:border-[#47773f]">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[#c8dda8] mb-2">Pro</h2>
              <div className="text-5xl font-extrabold text-[#a0a0a0]">
                $6.99
                <span className="text-xl font-normal text-[#5a6e4a]">/mo</span>
              </div>
              <p className="text-[#5a6e4a] text-sm mt-1">billed monthly</p>
              {/* list of benifits*/}
            </div>
            <ul className="flex flex-col gap-4 text-left mb-8 flex-1">
              <li className="border-b border-[#3d6b3d] pb-4 text-sm flex items-center gap-2">
                <span className="text-[#8aaa62]">✓</span> Everything in Free
              </li>
              <li className="border-b border-[#3d6b3d] pb-4 text-sm flex items-center gap-2">
                <span className="text-[#8aaa62]">✓</span> Unlimited items
              </li>
              <li className="border-b border-[#3d6b3d] pb-4 text-sm flex items-center gap-2">
                <span className="text-[#8aaa62]">✓</span> Show item type/brand
                with the best profit margin
              </li>
              <li className="border-b border-[#3d6b3d] pb-4 text-sm flex items-center gap-2">
                <span className="text-[#8aaa62]">✓</span> Receipt scanning
              </li>
              <li className="border-b border-[#3d6b3d] pb-4 text-sm flex items-center gap-2">
                <span className="text-[#8aaa62]">✓</span> Photo uploads per item
              </li>
            </ul>

            <button className="w-full bg-[#8aaa62] text-[#0d120d] py-3 rounded-xl font-bold hover:bg-[#a8c47a] transition-all">
              Try Pro Free for 7 days
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Pricing;
