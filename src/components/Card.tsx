// import * as React from "react";

// export function Card() {
//   return (
//     <div>
//       <ul className="flex flex-col md:grid grid-cols-3 gap-5 text-redis-neutral-800 max-w-2xl mx-auto p-10 mt-10">
//         <li className="w-full text-sm font-semibold text-slate-900 p-6 bg-white border border-slate-900/10 bg-clip-padding shadow-md shadow-slate-900/5 rounded-lg flex flex-col justify-center">
//           <span className="mb-1 text-teal-400 font-display text-5xl">45K</span>
//           Buyers
//         </li>
//         <li className="w-full text-sm font-semibold text-slate-900 p-6 bg-white border border-slate-900/10 bg-clip-padding shadow-md shadow-slate-900/5 rounded-lg flex flex-col justify-center">
//           <span className="mb-1 text-teal-400 font-display text-5xl">78K+</span>
//           Total Value Locked
//         </li>
//         <li className="w-full text-sm font-semibold text-slate-900 p-6 bg-white border border-slate-900/10 bg-clip-padding shadow-md shadow-slate-900/5 rounded-lg flex flex-col justify-center">
//           <span className="mb-1 text-teal-400 font-display text-5xl">50+</span>
//           Total Claimed Amount
//         </li>
//       </ul>
//     </div>
//   );
// }

import * as React from "react";

export function Card() {
  return (
    <div>
      <ul className="flex flex-col md:grid grid-cols-3 gap-5 text-redis-neutral-800 max-w-5xl mx-auto p-10 mt-10">
        <li className="w-full text-sm font-semibold text-slate-900 p-6 bg-white border border-slate-900/10 bg-clip-padding shadow-md shadow-slate-900/5 rounded-lg flex flex-col justify-center whitespace-nowrap">
          <span className="mb-1 text-teal-400 font-display text-5xl">45K</span>
          Buyers
        </li>
        <li className="w-full text-sm font-semibold text-slate-900 p-6 bg-white border border-slate-900/10 bg-clip-padding shadow-md shadow-slate-900/5 rounded-lg flex flex-col justify-center whitespace-nowrap">
          <span className="mb-1 text-teal-400 font-display text-5xl">78K+</span>
          Total Value Locked
        </li>
        <li className="w-full text-sm font-semibold text-slate-900 p-6 bg-white border border-slate-900/10 bg-clip-padding shadow-md shadow-slate-900/5 rounded-lg flex flex-col justify-center whitespace-nowrap">
          <span className="mb-1 text-teal-400 font-display text-5xl">50+</span>
          Total Claimed Amount
        </li>
      </ul>
    </div>
  );
}
