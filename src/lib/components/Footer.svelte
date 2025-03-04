<script lang="ts">
  import { getCartItems, clearCart, getTotalQuantity } from "$lib/stores/Cart.svelte";
  let cartItems = $state(getCartItems());

  // Update the total cost based on cart items
  let totalCost = $derived.by(() => {
    return getCartItems().reduce((total, item) => total + item.price * item.quantity, 0);
  });

</script>


{#if totalCost > 0}
  <div class="fixed bottom-0 left-0 w-full z-0 bg-white border-t border-gray-200 shadow-t-4">
    <div class="flex justify-between items-center mt-2">
      <span>Total</span>
      <span>${totalCost.toFixed(2)}</span>
    </div>
    <button class="w-full bg-primary text-white py-2 mt-2" on:click={clearCart}>Clear Cart</button>
  </div>
{/if}

<footer class="text-center p-4 shadow-lg bg-gray-100 shadow-t-4">
  <p>&copy; {new Date().getFullYear()} Medina's Cocina</p>
</footer>