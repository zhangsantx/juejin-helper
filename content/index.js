const cacheKeyPrefix = "JUEJINHELPER_";
const cacheKeys = {
  articleFilterKeywords: cacheKeyPrefix + "articleFilterKeywords",
  pinFilterKeywords: cacheKeyPrefix + "pinFilterKeywords",
  isOpenFilter: cacheKeyPrefix + "isOpenFilter",
};

/** 关键词匹配 */
const matchKeywords = (keywords, text) => {
  if (!text) return false;
  if (!keywords.length) return false;
  return keywords.some((keyword) =>
    text.toUpperCase().includes(keyword.toUpperCase())
  );
};

/** 根据关键词过滤启动页文章 */
const filterArticlesByKeywordsOfStartPage = (keywords) => {
  if (!keywords.length) return;
  document
    .querySelector(".feed-list")
    ?.querySelectorAll(".item")
    ?.forEach((item) => {
      const innerText = item
        ?.querySelector(".feed-item")
        ?.querySelector(".content")?.innerText;
      if (matchKeywords(keywords, innerText)) {
        item.remove();
      }
    });
};

/** 根据关键词过滤启动页沸点 */
const filterPinsByKeywordsOfStartPage = (keywords) => {
  if (!keywords.length) return;
  document
    .querySelector(".pins-list")
    ?.querySelectorAll(".pin")
    ?.forEach((item) => {
      const innerText = item
        ?.querySelector(".item-content")
        ?.querySelector(".content")?.innerText;
      if (matchKeywords(keywords, innerText)) {
        item.remove();
      }
    });
};

let intervalId;
let isShowedNotice = false;
const startFilterKeywords = () => {
  try {
    chrome.storage.local.get(Object.values(cacheKeys), (result) => {
      if (result[cacheKeys.isOpenFilter]) {
        if (!isShowedNotice) {
          console.log(
            `%cJueJin Helper%cfilters runing`,
            "background: #1e80fe; font-size: 15px; color: #fff; border-radius: 2px 0 0 2px; padding: 1px 4px;",
            "background: #333; font-size: 15px; color: #1e80fe; border-radius: 0 2px 2px 0; padding: 1px 4px;"
          );
          isShowedNotice = true;
        }
        if (result[cacheKeys.articleFilterKeywords]) {
          filterArticlesByKeywordsOfStartPage(
            result[cacheKeys.articleFilterKeywords]?.split(",")
          );
        }
        if (result[cacheKeys.pinFilterKeywords]) {
          filterPinsByKeywordsOfStartPage(
            result[cacheKeys.pinFilterKeywords]?.split(",")
          );
        }
      } else {
        if (!isShowedNotice) {
          console.log(
            `%cJueJin Helper%cfilters stopped`,
            "background: #1e80fe; font-size: 15px; color: #fff; border-radius: 2px 0 0 2px; padding: 1px 4px;",
            "background: #333; font-size: 15px; color: #e46962; border-radius: 0 2px 2px 0; padding: 1px 4px;"
          );
          isShowedNotice = true;
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
};

const startInterval = () => {
  try {
    clearInterval(intervalId);
    if (!document.hidden) {
      intervalId = setInterval(startFilterKeywords, 500);
      startFilterKeywords();
    }
  } catch (error) {
    console.log(error);
  }
};

document.addEventListener("visibilitychange", startInterval);

startInterval();
