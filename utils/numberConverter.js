export const convertEnglishToArabic = (number) => {
  const arabicNumbers = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return String(number).replace(/\d/g, (digit) => arabicNumbers[digit]);
};