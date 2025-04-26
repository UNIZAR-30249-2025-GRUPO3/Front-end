import React from "react";
import { Button } from "react-bootstrap";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Pagination = ({ currentPage, totalPages, paginate }) => {
  const pageNumbers = [];
  const maxVisiblePages = 3;

  if (totalPages <= maxVisiblePages) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, currentPage + 1);

    if (currentPage === 1) {
      startPage = 1;
      endPage = 3;
    } else if (currentPage === totalPages) {
      startPage = totalPages - 2;
      endPage = totalPages;
    }

    if (startPage > 1) {
      pageNumbers.push(1);
      if (startPage > 2) pageNumbers.push("...");
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pageNumbers.push("...");
      pageNumbers.push(totalPages);
    }
  }

  return (
    <div className="d-flex justify-content-center mt-3">
      <Button
        onClick={() => paginate(currentPage - 1)}
        disabled={currentPage === 1}
        className="mx-1 p-1 d-flex align-items-center justify-content-center"
        style={{ minWidth: "28px", height: "28px", backgroundColor: "#D6EAFF", borderColor: "#000842", color: "#000842", fontSize: "13px", fontWeight: "bold" }}
      >
        <FaChevronLeft />
      </Button>

      {pageNumbers.map((number, index) => (
        <Button
          key={index}
          onClick={() => typeof number === "number" && paginate(number)}
          className="mx-1 p-1 d-flex align-items-center justify-content-center"
          style={{
            minWidth: "28px",
            height: "28px",
            backgroundColor: currentPage === number ? "#000842" : "#D6EAFF",
            borderColor: "#000842",
            color: currentPage === number ? "white" : "#000842",
            cursor: typeof number === "number" ? "pointer" : "default",
            fontSize: "13px",
            fontWeight: "bold"
          }}
          disabled={number === "..."}
        >
          {number}
        </Button>
      ))}

      <Button
        onClick={() => paginate(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="mx-1 p-1 d-flex align-items-center justify-content-center"
        style={{ minWidth: "28px", height: "28px", backgroundColor: "#D6EAFF", borderColor: "#000842", color: "#000842", fontSize: "13px", fontWeight: "bold" }}
      >
        <FaChevronRight />
      </Button>
    </div>
  );
};

export default Pagination;