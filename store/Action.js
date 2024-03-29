export const ACTIONS = {
  NOTIFY: "NOTIFY",
  AUTH: "AUTH",
  ADD_CART: "ADD_CART",
  ADD_ORDER: "ADD_ORDER",
  ADD_USER: "ADD_USER",
  ADD_CATEGORIES: "ADD_CATEGORIES",
};

export const addCart = (product, cart) => {
  if (product.inStock === 0)
    return {
      type: "NOTIFY",
      payload: { error: "This product is out of stock" },
    };

  const check = cart.every((item) => item._id !== product._id);

  if (!check)
    return {
      type: "NOTIFY",
      payload: { error: "This product has been added to cart" },
    };

  return {
    type: "ADD_CART",
    payload: [...cart, { ...product, quantity: 1 }],
  };
};

export const increase = (data, id) => {
  const newData = [...data];
  newData.forEach((item) => {
    if (item._id === id) {
      item.quantity += 1;
    }
  });

  return {
    type: "ADD_CART",
    payload: newData,
  };
};

export const decrease = (data, id) => {
  const newData = [...data];
  newData.forEach((item) => {
    if (item._id === id) {
      item.quantity -= 1;
    }
  });

  return {
    type: "ADD_CART",
    payload: newData,
  };
};

export const deleteItem = (data, id, type) => {
  const newData = [...data].filter((item) => item._id !== id);
  return {
    type: type,
    payload: newData,
  };
};

export const updateItem = (data, post, id, type) => {
  const newData = data.map((item) => (item._id === id ? post : item));
  return {
    type: type,
    payload: newData,
  };
};
