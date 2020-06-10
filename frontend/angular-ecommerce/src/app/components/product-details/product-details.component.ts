import { Component, OnInit } from "@angular/core";
import { Product } from "src/app/common/product";
import { ProductService } from "src/app/services/product.service";
import { ActivatedRoute } from "@angular/router";
import { CartService } from 'src/app/services/cart.service';
import { CartItem } from 'src/app/common/cart-item';

@Component({
  selector: "app-product-details",
  templateUrl: "./product-details.component.html",
  styleUrls: ["./product-details.component.css"]
})
export class ProductDetailsComponent implements OnInit {
  product: Product = new Product();

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private cartService: CartService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      this.handleProductDetails();
    });
  }
  handleProductDetails() {
    //get the id param string and convert it into a number
    const productId = this.route.snapshot.paramMap.get("id");

    this.productService.getProduct(productId).subscribe(data => {
      this.product = data;
    });
  }

  addToCart() {
    console.log(`Adding to Cart = ${this.product.name} ,Price =${this.product.unitPrice}`)

    const theCartItem = new CartItem(this.product)

    this.cartService.addToCart(theCartItem);
  }
}
