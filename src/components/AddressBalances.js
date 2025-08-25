import React, { useState, useEffect } from "react";

export default function AddressBalances({ balances }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 100;

  const extractAddress = (fullAddress) => {
    const parts = fullAddress.split('_');
    return parts.length > 1 ? parts[1] : fullAddress;
  };

  // 重置页码当数据变化时
  useEffect(() => {
    setCurrentPage(1);
  }, [balances]);

  // 计算分页相关数据
  const totalItems = balances.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = balances.slice(startIndex, endIndex);

  // 分页控件处理函数
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goToPrevious = () => {
    goToPage(currentPage - 1);
  };

  const goToNext = () => {
    goToPage(currentPage + 1);
  };

  // 生成页码按钮
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  return (
    <div className="paginated-table-container">
      <div className="data-table">
        <table className="table">
          <thead className="table-header orange">
            <tr>
              <th>Address</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((b, idx) => (
              <tr key={startIndex + idx} className="table-row orange">
                <td className="table-cell mono">{extractAddress(b.address)}</td>
                <td className="table-cell highlight orange">{b.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination-container">
          <div className="pagination-info">
            显示 {startIndex + 1}-{Math.min(endIndex, totalItems)} 条，共 {totalItems} 条
          </div>

          <div className="pagination-controls">
            <button
              className="pagination-btn"
              onClick={goToPrevious}
              disabled={currentPage === 1}
            >
              上一页
            </button>

            {currentPage > 3 && (
              <>
                <button className="pagination-btn" onClick={() => goToPage(1)}>
                  1
                </button>
                {currentPage > 4 && <span className="pagination-ellipsis">...</span>}
              </>
            )}

            {getPageNumbers().map(pageNum => (
              <button
                key={pageNum}
                className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
                onClick={() => goToPage(pageNum)}
              >
                {pageNum}
              </button>
            ))}

            {currentPage < totalPages - 2 && (
              <>
                {currentPage < totalPages - 3 && <span className="pagination-ellipsis">...</span>}
                <button className="pagination-btn" onClick={() => goToPage(totalPages)}>
                  {totalPages}
                </button>
              </>
            )}

            <button
              className="pagination-btn"
              onClick={goToNext}
              disabled={currentPage === totalPages}
            >
              下一页
            </button>
          </div>

          <div className="pagination-info">
            第 {currentPage} 页，共 {totalPages} 页
          </div>
        </div>
      )}
    </div>
  );
}
