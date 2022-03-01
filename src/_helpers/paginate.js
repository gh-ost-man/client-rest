const paginate = (
    totalItems,
    currentPage,
    itemsCntOnPage
) => {

    //  itemsCntOnPage = 2;

    let totalPages = Math.ceil(totalItems / itemsCntOnPage);

    let startIndex = (currentPage - 1) * itemsCntOnPage;
    let endIndex = Math.min(startIndex + itemsCntOnPage - 1, totalItems - 1);
    let startPage = 0;
    let endPage = 0;

    if (currentPage >= 10) {
        startPage = currentPage - 5;
        if (currentPage > totalPages) {
            endPage = totalPages;
        } else {
            if (currentPage + 5 <= totalPages) {
                endPage = currentPage + 5;
            } else {
                endPage = totalPages;
            }
        }
    } else {
        startPage = 1;
        endPage = Math.ceil(totalItems / itemsCntOnPage) > 10 ? 10 : Math.ceil(totalItems / itemsCntOnPage);
    }

    if (endPage <= 0) {
        endPage = 1;
    }

    console.log("FROM: ", (endPage + 1) - startPage);

    let pages = Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i);

    // console.log("Total PAGES: ", totalPages);
    // console.log("Current PAGE: ", currentPage);
    // console.log("START PAGE: ", startPage);
    // console.log("END PAGE: ", endPage);

    // console.log("CON:", Math.ceil(count / itemsCntOnPage) > currentPage + itemsCntOnPage);






    return {
        startPage: startPage,
        endPage: endPage,
        startIndex: startIndex,
        endIndex: endIndex,
        pages: pages,
        totalPages: totalPages
    }
}

export default paginate;