
const Pagination = ({
  totalItems,
  totalPages,
  currentPage,
  setPage,
  itemsPerPage,
  setItemsPerPage,
}: {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  setPage: (page: number) => void;
  itemsPerPage: number;
  setItemsPerPage: (itemsPerPage: number) => void;
}) => {
  const pageToShow = 5;

  const startPage = Math.max(1, currentPage - Math.floor(pageToShow / 2));
  const endPage = Math.min(totalPages, startPage + pageToShow - 1);

  const visiblePages = Array.from(
    { length: endPage - startPage + 1 },
    (_, index) => startPage + index
  );

  return (
    <div className="flex justify-between items-center mt-5 space-x-2 mb-3 mx-3">
      <h1>
        Total{" "}
        {totalItems > 1 ? `${totalItems} users` : `${totalItems} user`}{" "}
        {/* {itemsPerPage > 1 ? `${itemsPerPage} users` : `${itemsPerPage} user`}{" "} */}
      </h1>
      <div className="flex flex-row gap-2 justify-center">
        <button
          className={`w-8 h-8 flex justify-center items-center rounded-full border ${currentPage === 1
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-white hover:bg-blue-100 text-gray-700"
            }`}
          onClick={() => currentPage > 1 && setPage(currentPage - 1)}
        >
          &lt;
        </button>
        {startPage > 1 && (
          <>
            <button
              className={`w-8 h-8 flex justify-center items-center rounded-full border bg-white hover:bg-blue-100 text-gray-700`}
              onClick={() => setPage(1)}
            >
              1
            </button>

            {startPage > 2 && (
              <span className="w-8 h-8 flex justify-center items-center text-gray-500">
                ...
              </span>
            )}
          </>
        )}
        {visiblePages.map((page: any) => (
          <button
            className={`w-8 h-8 flex justify-center items-center rounded-full border ${currentPage === page
              ? "bg-gray-800 text-white font-bold"
              : "bg-white hover:bg-blue-100 text-gray-700"
              }`}
            onClick={() => setPage(page)}
          >
            {page}
          </button>
        ))}
        {endPage < totalPages && (
          <span className="w-8 h-8 flex justify-center items-center text-gray-500">
            ...
          </span>
        )}
        <button
          className={`w-8 h-8 flex justify-center items-center rounded-full border ${currentPage === totalPages
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-white hover:bg-blue-100 text-gray-700"
            }`}
          onClick={() => currentPage < totalPages && setPage(currentPage + 1)}
        >
          &gt;
        </button>
        <div className="flex items-center gap-2">
          <select
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 p-2"
            onChange={(e: any) => {
              setItemsPerPage(e.target.value);
              setPage(1);
            }}
          >
            <option value={10}>10 </option>
            <option value={15}>15</option>
            <option value={20}>20</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className=" h-max">users/page </span>
        </div>
      </div>
      <span>Total {totalPages} pages</span>


    </div>
  );
};

export default Pagination;
