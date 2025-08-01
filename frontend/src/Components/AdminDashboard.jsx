import React, { Children } from "react";
import { Link } from "react-router-dom";

function AdminDashboard({children}) {
  return (
    <div className="w-dvw h-dvh bg-gray-200 grid grid-cols-7 mx-auto">
      {/* SideBar */}
      <div className="col-span-1 bg-white">
        <div className="p-2 h-full w-full flex flex-col bg-white dark:bg-gray-900 border-r border-r-gray-200">
          {/* Logo */}
          <Link to="#">
            <div className="flex justify-center lg:justify-start items-center gap-2 py-2 px-0 md:px-2 lg:px-4 cursor-pointer ">
              <svg
                width={36}
                height={36}
                viewBox="0 0 903 1000"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M814.39 736.55L751.05 699.74L750.81 617.11L814.15 653.92L814.39 736.55Z"
                  fill="#00717E"
                />
                <path
                  d="M520.46 997.94L457.12 961.13L456.86 869.58L520.2 906.39L520.46 997.94Z"
                  fill="#00717E"
                />
                <path
                  d="M520.2 906.39L456.86 869.58L751.05 699.74L814.39 736.55L520.2 906.39Z"
                  fill="#00B6CA"
                />
                <path
                  d="M608.06 681.21L544.72 644.4L838.91 474.55L902.25 511.36L608.06 681.21Z"
                  fill="#00B6CA"
                />
                <path
                  d="M519.97 823.77L456.63 786.96L455.87 521.56L519.22 558.37L519.97 823.77Z"
                  fill="#00717E"
                />
                <path
                  d="M519.22 558.37L455.87 521.56L838.41 300.7L901.75 337.51L519.22 558.37Z"
                  fill="#00B6CA"
                />
                <path
                  d="M901.75 337.51L902.01 429.05L607.83 598.9L608.06 681.21L902.25 511.36L903 777.08L520.46 997.94L520.2 906.39L814.39 736.55L814.15 653.92L519.97 823.77L519.22 558.37L901.75 337.51Z"
                  fill="#00A3B6"
                />
                <path
                  d="M75.75 554.2L139.09 517.4L138.34 784.69L75 821.5L75.75 554.2Z"
                  fill="#1D49C5"
                />
                <path
                  d="M1.25 338.65L64.59 301.84L149.22 350.7L85.88 387.51L1.25 338.65Z"
                  fill="#2152DC"
                />
                <path
                  d="M85.88 387.51L149.22 350.7L255.26 668.51L191.92 705.32L85.88 387.51Z"
                  fill="#2459EF"
                />
                <path
                  d="M308.29 688.46L371.63 651.65L254.74 851.89L191.4 888.7L308.29 688.46Z"
                  fill="#1D49C5"
                />
                <path
                  d="M383.77 559.5L447.11 522.69L445.87 962.24L382.53 999.05L383.77 559.5Z"
                  fill="#1D49C5"
                />
                <path
                  d="M299.15 510.64L362.49 473.83L447.11 522.69L383.77 559.5L299.15 510.64Z"
                  fill="#2152DC"
                />
                <path
                  d="M383.77 559.5L382.53 999.05L307.53 955.76L308.29 688.46L191.4 888.7L75.75 554.2L75 821.5L0 778.2L1.25 338.65L85.88 387.51L191.92 705.32L299.15 510.64L383.77 559.5Z"
                  fill="#143389"
                />
                <path
                  d="M832.32 218.54L832.12 291.8L752.97 337.8L753.18 264.54L832.32 218.54Z"
                  fill="#007DC5"
                />
                <path
                  d="M753.18 264.54L752.97 337.8L370.44 116.94L370.65 43.68L753.18 264.54Z"
                  fill="#005789"
                />
                <path
                  d="M449.8 -2.31L832.32 218.54L753.18 264.54L370.65 43.68L449.8 -2.31Z"
                  fill="#008CDC"
                />
                <path
                  d="M387.82 136.05L387.62 209.31L237.03 296.82L237.23 223.56L387.82 136.05Z"
                  fill="#007DC5"
                />
                <path
                  d="M514.52 300.89L514.31 374.15L421.06 320.31L421.27 247.05L514.52 300.89Z"
                  fill="#005789"
                />
                <path
                  d="M452.27 439.4L452.06 512.66L69.54 291.81L69.74 218.55L452.27 439.4Z"
                  fill="#005789"
                />
                <path
                  d="M602.86 351.89L531.42 393.41L452.27 439.4L452.06 512.66L531.21 466.67L602.65 425.15L681.8 379.15L682.01 305.89L602.86 351.89Z"
                  fill="#007DC5"
                />
                <path
                  d="M421.27 247.05L500.41 201.05L682.01 305.89L602.86 351.89L531.42 393.41L452.27 439.4L69.74 218.55L299.48 85.04L387.82 136.05L237.23 223.56L443.08 342.4L514.52 300.89L421.27 247.05Z"
                  fill="#008CDC"
                />
              </svg>
            </div>
          </Link>
          <div className="flex flex-col h-full overflow-y-auto overflow-x-hidden flex-grow pt-2 justify-between">
            <div className="flex flex-col  space-y-1 mx-1 lg:mt-1 ">
              <div className="px-5 pt-4 hidden lg:block">
                <div className="flex flex-row items-center">
                  <div className="text-xs font-bold tracking-wide text-gray-600">
                    Menu
                  </div>
                </div>
              </div>
              <Link
                className="flex flex-row items-center  justify-center lg:justify-start rounded-md h-12 focus:outline-none pr-3.5  lg:pr-6 font-semibold text-gray-500 hover:text-primary-400 cursor-pointer "
                to="/admin-dashboard"
              >
                <span className="inline-flex justify-center items-center ml-3.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1.25rem"
                    height="1.25rem"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M10.894 22h2.212c3.447 0 5.17 0 6.345-1.012s1.419-2.705 1.906-6.093l.279-1.937c.38-2.637.57-3.956.029-5.083s-1.691-1.813-3.992-3.183l-1.385-.825C14.2 2.622 13.154 2 12 2s-2.199.622-4.288 1.867l-1.385.825c-2.3 1.37-3.451 2.056-3.992 3.183s-.35 2.446.03 5.083l.278 1.937c.487 3.388.731 5.081 1.906 6.093S7.447 22 10.894 22"
                      opacity=".5"
                    />
                    <path
                      fill="currentColor"
                      d="M9.447 15.397a.75.75 0 0 0-.894 1.205A5.77 5.77 0 0 0 12 17.75a5.77 5.77 0 0 0 3.447-1.148a.75.75 0 0 0-.894-1.205A4.27 4.27 0 0 1 12 16.25a4.27 4.27 0 0 1-2.553-.853"
                    />
                  </svg>
                </span>
                <span className="ml-0 lg:ml-2 text-sm tracking-wide truncate capitalize hidden lg:block">
                  Dashboard
                </span>
              </Link>
              <Link
                className="flex flex-row items-center  justify-center lg:justify-start rounded-md h-12 focus:outline-none pr-3.5  lg:pr-6 font-semibold text-gray-500 hover:text-primary-400 cursor-pointer "
                to="/gen-task"
              >
                <span className="inline-flex justify-center items-center ml-3.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1.25rem"
                    height="1.25rem"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <g opacity="0.50">
                      <path
                        d="M21 8H13C12.7348 8 12.4804 7.89464 12.2929 7.70711C12.1054 7.51957 12 7.26522 12 7C12 6.73478 12.1054 6.48043 12.2929 6.29289C12.4804 6.10536 12.7348 6 13 6H21C21.2652 6 21.5196 6.10536 21.7071 6.29289C21.8946 6.48043 22 6.73478 22 7C22 7.26522 21.8946 7.51957 21.7071 7.70711C21.5196 7.89464 21.2652 8 21 8ZM21 12H13C12.7348 12 12.4804 11.8946 12.2929 11.7071C12.1054 11.5196 12 11.2652 12 11C12 10.7348 12.1054 10.4804 12.2929 10.2929C12.4804 10.1054 12.7348 10 13 10H21C21.2652 10 21.5196 10.1054 21.7071 10.2929C21.8946 10.4804 22 10.7348 22 11C22 11.2652 21.8946 11.5196 21.7071 11.7071C21.5196 11.8946 21.2652 12 21 12Z"
                        fill="currentColor"
                      />
                      <path
                        d="M21 16H3C2.73478 16 2.48043 15.8946 2.29289 15.7071C2.10536 15.5196 2 15.2652 2 15C2 14.7348 2.10536 14.4804 2.29289 14.2929C2.48043 14.1054 2.73478 14 3 14H21C21.2652 14 21.5196 14.1054 21.7071 14.2929C21.8946 14.4804 22 14.7348 22 15C22 15.2652 21.8946 15.5196 21.7071 15.7071C21.5196 15.8946 21.2652 16 21 16ZM13 20H3C2.73478 20 2.48043 19.8946 2.29289 19.7071C2.10536 19.5196 2 19.2652 2 19C2 18.7348 2.10536 18.4804 2.29289 18.2929C2.48043 18.1054 2.73478 18 3 18H13C13.2652 18 13.5196 18.1054 13.7071 18.2929C13.8946 18.4804 14 18.7348 14 19C14 19.2652 13.8946 19.5196 13.7071 19.7071C13.5196 19.8946 13.2652 20 13 20Z"
                        fill="currentColor"
                      />
                    </g>
                    <rect
                      x={2}
                      y={4}
                      width={8}
                      height={8}
                      rx={2}
                      fill="currentColor"
                    />
                  </svg>
                </span>
                <span className="ml-0 lg:ml-2 text-sm tracking-wide truncate capitalize hidden lg:block">
                  Generate Task
                </span>
              </Link>
            
              
            </div>
            
          </div>
          <div className="px-1">
            <div className="flex flex-row items-center  justify-center lg:justify-start rounded-md h-12 focus:outline-none pr-3.5  lg:pr-6 font-semibold text-gray-500 hover:text-primary-400 cursor-pointer  hover:text-red-600">
              <span className="inline-flex justify-center items-center ml-3.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.25rem"
                  height="1.25rem"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M15 2h-1c-2.828 0-4.243 0-5.121.879C8 3.757 8 5.172 8 8v8c0 2.828 0 4.243.879 5.121C9.757 22 11.172 22 14 22h1c2.828 0 4.243 0 5.121-.879C21 20.243 21 18.828 21 16V8c0-2.828 0-4.243-.879-5.121C19.243 2 17.828 2 15 2"
                    opacity=".6"
                  />
                  <path
                    fill="currentColor"
                    d="M8 8c0-1.538 0-2.657.141-3.5H8c-2.357 0-3.536 0-4.268.732S3 7.143 3 9.5v5c0 2.357 0 3.535.732 4.268S5.643 19.5 8 19.5h.141C8 18.657 8 17.538 8 16z"
                    opacity=".4"
                  />
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M4.47 11.47a.75.75 0 0 0 0 1.06l2 2a.75.75 0 0 0 1.06-1.06l-.72-.72H14a.75.75 0 0 0 0-1.5H6.81l.72-.72a.75.75 0 1 0-1.06-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <span className="ml-2 text-sm tracking-wide truncate capitalize hidden lg:block">
                Logout
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* View Content */}
      <div className="col-span-6 h-[100vh] overflow-y-scroll  bg-white">
    {children}
      </div>
    </div>
  );
}

export default AdminDashboard;
// 