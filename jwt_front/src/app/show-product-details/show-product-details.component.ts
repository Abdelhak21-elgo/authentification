import { Component, OnInit } from '@angular/core';
import { ProductService } from '../_Services/product.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Product } from '../_Model/Product.model';
import { MatDialog } from '@angular/material/dialog';
import { ShowProductImageDialogComponent } from '../show-product-image-dialog/show-product-image-dialog.component';
import { ImageProessingService } from '../image-proessing.service';
import { map } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-show-product-details',
  templateUrl: './show-product-details.component.html',
  styleUrls: ['./show-product-details.component.css']
})
export class ShowProductDetailsComponent implements OnInit {
  productDetails: Product[] = [];
  pageNumber : number =0;

  displayedColumns: string[] = ['productId', 'productName', 'description', 'productCurentPrice', 'productDiscountedPrice', 'Actions'];
  constructor(private productService: ProductService, public ImgsDialog: MatDialog,
     private imageprocessingService: ImageProessingService, private router : Router) { }

  ngOnInit(): void {
    this.getAllProducts();
  }

  public getAllProducts() {
    this.productService.getAllProducts(this.pageNumber)
      .pipe(
        map((x: Product[], i) => x.map((product: Product) => this.imageprocessingService.createImafes(product)))
      )
      .subscribe(
        (response: Product[]) => {
          // console.log(response);
          this.productDetails = response;
        },
        (error: HttpErrorResponse) => {
          console.log(error);
        }
      );
  }

  deleproduct(productId: any) {
    console.log(productId);
    this.productService.deletProductDetails(productId).subscribe(
      (response: any) => {
        // console.log(response);
        this.getAllProducts();
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    );
  }

  showImages(product: Product) {
    console.log(product);
    this.ImgsDialog.open(ShowProductImageDialogComponent, {
      data : {
        images : product.productImages
      },
      height: '400px',
      width: '600px',
    });
  }

  editProductDetails(productId :any){
    this.router.navigate(["/AddProduct", {productId : productId}]);
  }


  loadMoreProductI(incrementBy: number) {
    if(this.pageNumber >= 10) return ;
    this.pageNumber+=incrementBy;
    this.getAllProducts();
    }

    loadMoreProductD(incrementBy: number) {
      if(this.pageNumber <= 0) return ;
      this.pageNumber-=incrementBy;
      this.getAllProducts();
      }
}
