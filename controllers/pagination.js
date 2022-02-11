exports.pagination = {
  getPagination: (page, size) => {
    if (page != 0) {
      const page = page - 1;
    }
    const limit = size ? +size : 10;
    const offset = page ? page * limit : 0;
    return { limit, offset };
  },

  getPagingData: (data1, page, limit) => {
    const { count: length, rows: data } = data1;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
    return { length, data, totalPages, currentPage };
  },

};
