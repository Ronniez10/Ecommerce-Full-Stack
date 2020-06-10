import { Component, OnInit } from "@angular/core";
import { ProductService } from "src/app/services/product.service";
import { Product } from "src/app/common/product";
import { ActivatedRoute } from "@angular/router";
import { CartService } from 'src/app/services/cart.service';
import { CartItem } from 'src/app/common/cart-item';

@Component({
  selector: "app-product-list",
  templateUrl: "./product-list-grid.component.html",
  styleUrls: ["./product-list.component.css"]
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  currentCategoryName: string = "books";
  searchMode: boolean = false;

  //new properties for pagination
  thePageNumber = 1;
  thePageSize = 10;
  theTotalElements = 0;

  previousKeyword: String = null;


  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private cartService: CartService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  updatePageSize(pageSize: number) {

    this.thePageNumber = 1;
    this.thePageSize = pageSize;
    this.listProducts();

  }


  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has("keyword");

    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProdcuts();
    }
  }

  //For Searching Products
  handleSearchProducts() {
    const keyword: string = this.route.snapshot.paramMap.get("keyword");

    //Checking whether the keyword is different to previous keyword

    if (this.previousKeyword != keyword) {
      this.thePageNumber = 1;
    }
    this.previousKeyword = keyword;

    console.log("Keyword=" + keyword + "Page Number=" + this.thePageNumber);

    this.productService.searchProductsPaginate(this.thePageNumber - 1, this.thePageSize, keyword)
      .subscribe(this.processProducts());

  }

  //For Listing Products
  handleListProdcuts() {
    // check if "id" parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has("id");

    if (hasCategoryId) {
      // get the "id" param string. convert string to a number using the "+" symbol
      this.currentCategoryId = +this.route.snapshot.paramMap.get("id");
      console.log("Id=" + this.route.snapshot.paramMap.get("id"));

      // get the "name" param string
      this.currentCategoryName = this.route.snapshot.paramMap.get("name");
      console.log("Name =" + this.route.snapshot.paramMap.get("name"));
    } else {
      // not category id available ... default to category id 1
      this.currentCategoryId = 1;
      this.currentCategoryName = "Books";
    }


    if (this.currentCategoryId != this.previousCategoryId) {
      this.thePageNumber = 1;

    }

    this.previousCategoryId = this.currentCategoryId;

    // now get the products for the given category id
    this.productService
      .getProductListPaginate(this.thePageNumber - 1, this.thePageSize, this.currentCategoryId)
      .subscribe(this.processProducts());
  }



  addToCart(theProduct: Product) {
    console.log(`Product Name= ${theProduct.name} and Product Price= ${theProduct.unitPrice}`)

    const theCartItem: CartItem = new CartItem(theProduct);

    this.cartService.addToCart(theCartItem)
  }

  processProducts() {
    return data => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    }
  }

}
