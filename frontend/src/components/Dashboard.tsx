import styles from "../styles/cs.module.css";

function Dashboard() {
  return (
    <div>
      <div className="mx-auto p-10">
        <h1
          className={`lg:text-6xl text-5xl font-extrabold mt-20 relative z-1 ${styles.chrome}`}
        >
          Dashboard.
        </h1>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-10">
          <div className="text-lg text-white flex gap-14 border-2 rounded-xl p-10">
            Total invested
          </div>
          <div className="text-lg text-white flex gap-14 border-2 rounded-xl p-10">
            Net Profit
          </div>
          <div className="text-lg text-white flex gap-14 border-2  rounded-xl p-10">
            Items Sold
          </div>
          <div className="text-lg text-white flex gap-14 border-2 rounded-xl p-10">
            Average Margin
          </div>
        </div>
      </div>
    </div>
  );
}
export default Dashboard;
