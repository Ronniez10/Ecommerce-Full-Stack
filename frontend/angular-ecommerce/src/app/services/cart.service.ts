import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { Subject } from 'rxjs';
import { IfStmt } from '@angular/compiler';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Injectable({
  providedIn: 'root'
})
export class CartService {


  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() { }

  addToCart(theCartItem: CartItem) {
    //check if we already have the item in the cart
    let exists: boolean = false;
    let existingItem: CartItem = undefined;

    if (this.cartItems.length > 0) {
      //find the item in the cart besed on Item ID

      existingItem = this.cartItems.find(tempItem => tempItem.id === theCartItem.id);

    }

    //check if we found the item on the cart
    exists = (existingItem != undefined)

    if (exists) {
      existingItem.quantity++;
    }
    else {
      this.cartItems.push(theCartItem);
    }

    //compute the Cart Total
    this.computeCartTotal();
  }

  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity--;

    if (theCartItem.quantity === 0) {
      this.remove(theCartItem);
    }
    else {
      this.computeCartTotal();
    }
  }
  remove(theCartItem: CartItem) {

    //Find the Index of the element to be Deleted
    const tempindex = this.cartItems.findIndex(tempItem => tempItem.id === theCartItem.id);

    //Check if the Index returned is -1 or not,if -1 the item does not exist
    if (tempindex > -1) {
      this.cartItems.splice(tempindex, 1);

      this.computeCartTotal();
    }
  }

  computeCartTotal() {

    let totalPriceValue = 0;
    let totalQuantityValue = 0;

    for (let tempCartItem of this.cartItems) {
      totalPriceValue = totalPriceValue + (tempCartItem.unitPrice * tempCartItem.quantity);
      totalQuantityValue += tempCartItem.quantity;
    }

    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    //log cart Data
    this.logCartData(totalPriceValue, totalQuantityValue);

  }


  //Logging Data to Console
  logCartData(totalPriceValue: number, totalQuantityValue: number) {

    console.log("Contents of the Cart")

    for (let tempItem of this.cartItems) {
      const subtotal = tempItem.quantity * tempItem.unitPrice;
      console.log(`Cart Item= ${tempItem.name} ,Quantity = ${tempItem.quantity}, subtotal = ${subtotal}`);
    }

    console.log(`Total Price =${totalPriceValue.toFixed(2)},total Quantity =${this.totalQuantity}`)
    console.log("-----")
  }
}
