<!-- Cart Modal -->
<div class="cart-modal">
<div class="cart-header">
    <h2>Shopping cart</h2>
    <button class="close-btn">&times;</button>
</div>
<form id="cart-form">
  <div id="inside-cart">
   <table>
    <thead>
      <tr>
        <th>Image</th>
        <th>Product</th>
        <th>Qty</th>
        <th>Total</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody id="cart-items">
    
  </tbody>
</table>
  </div>
    <div class="total">
        Total: Rs<span id="cart-total"></span>
    </div>
    <div class="modal-footer">
        <button type="button" id="btn-update" class="cart-btn btn-update">Update</button>
        <button type="button" id="btn-checkout" class="cart-btn btn-checkout">Checkout</button>
    </div>
</form>
</div>