const cacheKeyPrefix = "JUEJINHELPER_";
const cacheKeys = {
  articleFilterKeywords: cacheKeyPrefix + "articleFilterKeywords",
  pinFilterKeywords: cacheKeyPrefix + "pinFilterKeywords",
  isOpenFilter: cacheKeyPrefix + "isOpenFilter",
};

document
  ?.querySelector("#filter-keywords-articles-start")
  ?.addEventListener("change", (e) => {
    chrome.storage.local.set(
      { [cacheKeys.articleFilterKeywords]: e.target.value },
      function () {
        console.log("Data saved", e.target.value);
      }
    );
  });

document
  ?.querySelector("#filter-keywords-pins-start")
  ?.addEventListener("change", (e) => {
    chrome.storage.local.set(
      { [cacheKeys.pinFilterKeywords]: e.target.value },
      function () {
        console.log("Data saved");
      }
    );
  });

document.querySelector("#open-filter").addEventListener("click", () => {
  chrome.storage.local.get(Object.values(cacheKeys), (result) => {
    const isOpen = result[cacheKeys.isOpenFilter];
    chrome.storage.local.set(
      { [cacheKeys.isOpenFilter]: !isOpen },
      function () {
        console.log("Data saved");
        const openFilterDom = document.querySelector("#open-filter");
        if (!isOpen) {
          openFilterDom.innerHTML = "关闭过滤";
          openFilterDom.style.background = "#1e80fe";
        } else {
          openFilterDom.innerHTML = "开启过滤";
          openFilterDom.style.background = "#ccc";
        }
      }
    );
  });
});

const initData = () => {
  chrome.storage.local.get(Object.values(cacheKeys), (result) => {
    document.querySelector("#filter-keywords-articles-start").value =
      result[cacheKeys.articleFilterKeywords];
    document.querySelector("#filter-keywords-pins-start").value =
      result[cacheKeys.pinFilterKeywords];

    const openFilterDom = document.querySelector("#open-filter");
    if (result[cacheKeys.isOpenFilter]) {
      openFilterDom.innerHTML = "关闭过滤";
      openFilterDom.style.background = "#1e80fe";
    } else {
      openFilterDom.innerHTML = "开启过滤";
      openFilterDom.style.background = "#ccc";
    }
  });
};
initData();
