exports.pagination = {
  getPagination: (page, size) => {
    // if (page != 0) {
    //   var page = page - 1;
    // }
    page ? page-- : 0;
    const limit = size ? +size : 10;
    const offset = page ? page * limit : 0;
    return { limit, offset };
  },

  getPagingData: (data1, page, limit) => {
    const { count: length, rows: data } = data1;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(length / limit);
    return { length, data, totalPages, currentPage };
  },
};
