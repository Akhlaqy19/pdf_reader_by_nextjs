import axios from "axios";

// https://core.rafed.net/api/rest/v1/book/[bookId]
// https://core.rafed.net/api/rest/v1/book/pages/360/[hitCount]
// https://core.rafed.net/api/rest/v1/book/[bookId]/download?type=pdf||pdfimg||doc
// https://core.rafed.net/api/rest/v1/book/pages/[bookId]/[startPage]/[limitPage]import axios from "axios";

const BASE_URL = "https://core.rafed.net/api/rest/v1";

// دریافت اطلاعات کتاب
export const getBookInfo = async (bookId) => {
  try {
    const response = await axios.get(`${BASE_URL}/book/${bookId}`);
    return response.data;
  } catch (error) {
    throw new Error(`خطا در دریافت اطلاعات کتاب: ${error.message}`);
  }
};

// دریافت صفحات کتاب با pagination
export const getBookPages = async (bookId, startPage = 1, limitPage = 20) => {
  try {
    const response = await axios.get(`${BASE_URL}/book/pages/${bookId}/${startPage}/${limitPage}`);
    return response.data;
  } catch (error) {
    throw new Error(`خطا در دریافت صفحات کتاب: ${error.message}`);
  }
};

// جستجو در کتاب
export const searchInBook = async (bookId, hitCount = 10) => {
  try {
    const response = await axios.get(`${BASE_URL}/book/pages/${bookId}/${hitCount}`);
    return response.data;
  } catch (error) {
    throw new Error(`خطا در جستجوی کتاب: ${error.message}`);
  }
};

// دانلود کتاب
export const downloadBook = async (bookId, type = 'pdf') => {
  try {
    const response = await axios.get(`${BASE_URL}/book/${bookId}/download?type=${type}`, {
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    throw new Error(`خطا در دانلود کتاب: ${error.message}`);
  }
};

// ترکیب اطلاعات کتاب و صفحات
export const getCompleteBookData = async (bookId, startPage = 1, limitPage = 10) => {
  try {
    const [bookInfo, bookPages] = await Promise.all([
      getBookInfo(bookId),
      getBookPages(bookId, startPage, limitPage)
    ]);
    
    return {
      info: bookInfo,
      pages: bookPages,
      currentPage: startPage,
      totalPages: bookInfo?.totalPages || 0
    };
  } catch (error) {
    throw new Error(`خطا در دریافت اطلاعات کامل کتاب: ${error.message}`);
  }
};
