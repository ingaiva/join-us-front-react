import React, { Fragment, useState, useEffect, useCallback } from "react";
import { MENUITEMS } from "../sidebar/menu";
const Bookmark = (props) => {
  // eslint-disable-next-line
  const [mainmenu, setMainMenu] = useState(MENUITEMS);
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState(false);
  // eslint-disable-next-line
  const [bookmarkSearch, SetBookmarkSearch] = useState(false);
  const [bookmarkItems, setBookmarkItems] = useState([]);

  const escFunction = useCallback((event) => {
    if (event.keyCode === 27) {
      //Do whatever when esc is pressed
      setSearchValue("");
      setSearchResult([]);
      SetBookmarkSearch(false);
      document.querySelector(".filled-bookmark").classList.remove("is-open");
      document
        .querySelector(".page-wrapper")
        .classList.remove("offcanvas-bookmark");
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);
    mainmenu.filter((menuItems) => {
      if (menuItems.bookmark) {
        setBookmarkItems((bookmarkItems) => [...bookmarkItems, menuItems]);
      }
      return menuItems;
    });
    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
    // eslint-disable-next-line
  }, []);

  const addnewbookmark = () => {
    document.querySelector(".flip-card-inner").classList.add("flipped");
  };
  const backtobookmark = () => {
    document.querySelector(".flip-card-inner").classList.remove("flipped");
  };

  const handleSearchKeyword = (keyword) => {
    keyword ? addFix() : removeFix();
    const items = [];
    setSearchValue(keyword);
    mainmenu.filter((menuItems) => {
      if (
        menuItems.title.toLowerCase().includes(keyword) &&
        menuItems.type === "link"
      ) {
        items.push(menuItems);
      }
      if (!menuItems.children) return false;
      menuItems.children.filter((subItems) => {
        if (
          subItems.title.toLowerCase().includes(keyword) &&
          subItems.type === "link"
        ) {
          subItems.icon = menuItems.icon;
          items.push(subItems);
        }
        if (!subItems.children) return false;
        subItems.children.filter((suSubItems) => {
          if (suSubItems.title.toLowerCase().includes(keyword)) {
            suSubItems.icon = menuItems.icon;
            items.push(suSubItems);
          }
          return suSubItems;
        });
        return subItems;
      });
      checkSearchResultEmpty(items);
      setSearchResult(items);
      return menuItems;
    });
  };

  const checkSearchResultEmpty = (items) => {
    if (!items.length) {
      document.querySelector(".empty-bookmark").classList.add("is-open");
    } else {
      document.querySelector(".empty-bookmark").classList.remove("is-open");
    }
  };

  const addFix = () => {
    document.querySelector(".filled-bookmark").classList.add("is-open");
  };

  const removeFix = () => {
    setSearchValue("");
    setSearchResult([]);
    document.querySelector(".filled-bookmark").classList.remove("is-open");
  };

  const addToBookmark = (event, items) => {
    const index = bookmarkItems.indexOf(items);
    if (index === -1 && !items.bookmark) {
      items.bookmark = true;
      event.currentTarget.classList.add("starred");
      setBookmarkItems([...bookmarkItems, items]);
    } else {
      event.currentTarget.classList.remove("starred");
      bookmarkItems.splice(index, 1);
      setBookmarkItems(bookmarkItems);
      items.bookmark = false;
    }
  };

  return <Fragment></Fragment>;
};

export default Bookmark;
