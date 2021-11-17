import { createContext, useReducer, useEffect } from "react";

import reducers from "./Reducer";
import { getData } from "../utils/fetchData";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const initialState = {
    notify: {},
    auth: {},
    cart: [],
    orders: [],
    users: [],
    categories: [],
  };
  const [state, dispatch] = useReducer(reducers, initialState);

  const { cart, auth } = state;

  useEffect(() => {
    const __NEXT__CART__MILAN__ = JSON.parse(
      localStorage.getItem("__NEXT__CART__MILAN__")
    );
    if (__NEXT__CART__MILAN__)
      dispatch({ type: "ADD_CART", payload: __NEXT__CART__MILAN__ });
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem("__NEXT__CART__MILAN__", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (auth.token) {
      getData("order", auth.token).then((res) => {
        if (res.err)
          return dispatch({ type: "NOTIFY", payload: { error: res.err } });
        dispatch({ type: "ADD_ORDER", payload: res.orders });
      });

      if (auth.user?.role === "admin") {
        getData("user", auth.token).then((res) => {
          if (res.err)
            return dispatch({ type: "NOTIFY", payload: { error: res.err } });

          dispatch({ type: "ADD_USER", payload: res.users });
        });
      }
    } else {
      dispatch({ type: "ADD_ORDER", payload: [] });
      dispatch({ type: "ADD_USER", payload: [] });
    }
  }, [auth.token]);

  return (
    <DataContext.Provider value={{ state, dispatch }}>
      {children}
    </DataContext.Provider>
  );
};
