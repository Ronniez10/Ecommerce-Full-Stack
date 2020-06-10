package com.neelav.ecommerce.dao;

import com.neelav.ecommerce.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@CrossOrigin("http://localhost:4200")
public interface ProductRepository extends JpaRepository<Product, Long> {

      Page<Product> findByCategoryId(@RequestParam("id")long id , Pageable pageable);

      /* List<Product> findByCategoryId(@RequestParam("id")long id ); */

      Page<Product> findByNameContaining(@RequestParam("name") String name,Pageable pageable);
}
