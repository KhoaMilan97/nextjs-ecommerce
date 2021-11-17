import React, { useEffect, useContext, useState } from "react";

import NavBar from "./NavBar";
import Notify from "./Notify";
import Copyright from "../Copyright";
import Loading from "../components/Loading";
import { DataContext } from "../../store/GlobalState";
import { getData } from "../../utils/fetchData";
import Spinner from "./Spinner";

function Layout({ children }) {
  const { state, dispatch } = useContext(DataContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const firstLogin = localStorage.getItem("firstLogin");
    if (firstLogin) {
      const checkAuth = async () => {
        try {
          const res = await getData("auth/accessToken");

          if (res.err) {
            setLoading(false);
            dispatch({
              type: "NOTIFY",
              payload: { error: res.err },
            });
            return localStorage.removeItem("firstLogin");
          }
          dispatch({
            type: "AUTH",
            payload: { token: res.access_token, user: res.user },
          });
          setLoading(false);
        } catch (err) {
          setLoading(false);
          console.log(err);
        }
      };

      checkAuth();
    } else {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    const firstLogin = localStorage.getItem("firstLogin");
    if (firstLogin) {
      getData("categories").then((res) => {
        if (res.err)
          return dispatch({ type: "NOTIFY", payload: { error: res.err } });
        dispatch({
          type: "ADD_CATEGORIES",
          payload: res.categories,
        });
      });
    }
  }, [dispatch]);

  if (loading) return <Spinner />;

  return (
    <div>
      <NavBar />
      <Notify />
      <Loading />
      {children}
      <Copyright />
    </div>
  );
}

export default Layout;
