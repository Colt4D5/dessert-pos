<script lang="ts">
  import { fade } from 'svelte/transition';
  import { getCartItems, clearCart, getTotalQuantity, increaseQuantity, decreaseQuantity } from "$lib/stores/Cart.svelte";
	import { goto } from '$app/navigation';
  let height = $state(0);
  let showCart = $state(false);
  let showDrawer = $state(false);
  let totalCost = $derived.by(() => {
    return getCartItems().reduce((total, item) => total + item.price * item.quantity, 0);
  });

  function navigate(e) {
    showDrawer = false;
    showCart = false;
    goto(`/${e.target.dataset.page}`);
}
</script>

<header class={`fixed w-full bg-primary shadow-md text-white transition-all z-10 ${height > 0 ? 'py-0' : 'py-2'}`}>
	<nav class="flex justify-between items-center p-4">
		<div class="hamburger" onclick={() => showDrawer = !showDrawer} role="button" tabindex="-1" aria-label="Open menu">
			<!-- Hamburger icon -->
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
				<path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
			</svg>
		</div>
		<div>
			<a href="/">Medina's Cocina</a>
		</div>
		<div class="relative" onclick={() => showCart = !showCart} role="button" tabindex="-1" aria-label="Open cart">
      {#if getTotalQuantity() > 0}
        <div class="absolute -left-2 -top-2 bg-red-600 rounded-full w-5 h-5 flex items-center justify-center">{getTotalQuantity()}</div>
      {/if}
			<!-- Shopping cart icon -->
			<svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.46785 10.2658C4.47574 10.3372 4.48376 10.4094 4.49187 10.4823L4.61751 11.6131C4.7057 12.4072 4.78218 13.0959 4.91562 13.6455C5.05917 14.2367 5.29582 14.7937 5.78931 15.2354C6.28281 15.6771 6.86251 15.8508 7.46598 15.9281C8.02694 16.0001 8.71985 16 9.51887 16H14.8723C15.4201 16 15.9036 16 16.3073 15.959C16.7448 15.9146 17.1698 15.8162 17.5785 15.5701C17.9872 15.324 18.2731 14.9944 18.5171 14.6286C18.7422 14.291 18.9684 13.8637 19.2246 13.3797L21.7141 8.67734C22.5974 7.00887 21.3879 4.99998 19.5 4.99998L9.39884 4.99998C8.41604 4.99993 7.57525 4.99988 6.90973 5.09287C6.5729 5.13994 6.24284 5.21529 5.93326 5.34375L5.78941 4.04912C5.65979 2.88255 4.67375 2 3.5 2H3C2.44772 2 2 2.44771 2 3C2 3.55228 2.44772 4 3 4H3.5C3.65465 4 3.78456 4.11628 3.80164 4.26998L4.46785 10.2658Z" fill="currentColor"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M14 19.5C14 18.1193 15.1193 17 16.5 17C17.8807 17 19 18.1193 19 19.5C19 20.8807 17.8807 22 16.5 22C15.1193 22 14 20.8807 14 19.5Z" fill="currentColor"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M5 19.5C5 18.1193 6.11929 17 7.5 17C8.88071 17 10 18.1193 10 19.5C10 20.8807 8.88071 22 7.5 22C6.11929 22 5 20.8807 5 19.5Z" fill="currentColor"/>
      </svg>
		</div>
	</nav>
</header>

{#if showCart || showDrawer}
	<div transition:fade={{ duration: 200 }} class="fixed left-0 top-0 w-screen h-screen bg-[#00000066] z-10" onclick={() => { showCart = false; showDrawer = false; }} role="button" tabindex="-1" aria-label="Close cart and menu"></div>
{/if}

<div class={`fixed top-0 right-0 w-[400px] h-full bg-white shadow-lg transition-transform transform z-30 overflow-scroll ${showCart ? 'translate-x-0' : 'translate-x-full'}`}>
  <div class="p-4">
    <h2 class="text-xl font-bold">Shopping Cart</h2>
    <ul>
      {#each getCartItems() as item}
        <li class="flex mt-4">
          <img src={item.image} alt={item.title} class="w-24 h-24 object-cover mr-4" />
          <div class="flex-1">
            <div class="flex justify-between items-center">
              <span class="font-bold">{item.title}</span>
              <span class="text-gray-600">${item.price.toFixed(2)}</span>
            </div>
            <div class="text-gray-500">{item.category}</div>
            <div class="flex items-center mt-2">
              <button class="text-xl px-2 py-2 flex-1 bg-gray-200 rounded" onclick={() => decreaseQuantity(item)}>-</button>
              <span class="mx-2">{item.quantity}</span>
              <button class="text-xl px-2 py-2 flex-1 bg-gray-200 rounded" onclick={() => increaseQuantity(item)}>+</button>
            </div>
          </div>
        </li>
      {:else}
        <p class="text-center">No items in cart</p>
      {/each}
    </ul>
    <div class="mt-4">
      <p class="text-lg font-bold">Subtotal: ${totalCost.toFixed(2)}</p>
    </div>
    {#if getCartItems().length}
      <div class="mt-4">
        <button class="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition-colors duration-300 w-full" onclick={clearCart}>
          Clear Cart
        </button>
      </div>
    {/if}
  </div>
</div>

<div class={`fixed top-0 left-0 h-full bg-white shadow-lg transition-transform transform z-20 ${showDrawer ? 'translate-x-0' : '-translate-x-full'}`} style="width: 300px;">
  <div class="p-4">
    <h2 class="text-xl font-bold">Menu</h2>
    <ul>
      <li class="mt-4"><button onclick={navigate} data-page="">Items</button></li>
      <li class="mt-4"><button onclick={navigate} data-page="admin">Admin</button></li>
    </ul>
  </div>
</div>

<svelte:window bind:scrollY={height} />