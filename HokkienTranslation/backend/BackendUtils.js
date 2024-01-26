// Return input language type ZH (Chinese) / EN (English)
const determineLanguage = (query) => {
  const chineseCharPattern = /[\u3400-\u9FBF]/;
  return chineseCharPattern.test(query) ? "ZH" : "EN";
};

export { determineLanguage };
