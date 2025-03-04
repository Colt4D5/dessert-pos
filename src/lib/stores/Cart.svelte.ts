let cartItems = $state<{ title: string; price: number; quantity: number }[]>([]);

function addItemToCart(item: { title: string; price: number }) {
  const existingItem = cartItems.find(cartItem => cartItem.title === item.title);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cartItems.push({ ...item, quantity: 1 });
  }
}

function removeItemFromCart(item: { title: string }) {
  const index = cartItems.findIndex(cartItem => cartItem.title === item.title);
  if (index !== -1) {
    if (cartItems[index].quantity > 1) {
      cartItems[index].quantity -= 1;
    } else {
      cartItems.splice(index, 1);
    }
  }
}

function clearCart() {
  cartItems.length = 0;
}

function getCartItems() {
  return cartItems;
}

function getTotalQuantity() {
  return cartItems.reduce((acc, item) => acc + item.quantity, 0);
}

function increaseQuantity(item: { title: string }) {
  const existingItem = cartItems.find(cartItem => cartItem.title === item.title);
  if (existingItem) {
    existingItem.quantity += 1;
  }
}

function decreaseQuantity(item: { title: string }) {
  const existingItem = cartItems.find(cartItem => cartItem.title === item.title);
  if (existingItem) {
    if (existingItem.quantity > 1) {
      existingItem.quantity -= 1;
    } else {
      cartItems = cartItems.filter(cartItem => cartItem.title !== item.title);
    }
  }
}

export { getCartItems, addItemToCart, removeItemFromCart, clearCart, getTotalQuantity, increaseQuantity, decreaseQuantity };
